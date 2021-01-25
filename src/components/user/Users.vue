<!--  -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="always">
      <el-row :gutter="20">
        <el-col :span="7" :offset="0">
          <!-- 搜索框 -->
          <el-input
            placeholder="搜索一下！"
            clearable
            @clear="getUserList"
            v-model="queryInfo.query"
          >
            <el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4" :offset="0">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 获取用户列表 -->
      <el-table :data="userList" stripe border style="margin-top: 15px">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template v-slot:default="scope">
            <el-switch
              @change="stateChange(scope.row)"
              v-model="scope.row.mg_state"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175px">
          <template v-slot:default="scope">
            <!-- 编辑图标 -->
            <el-tooltip
              transition="none"
              content="编辑"
              placement="top"
              effect="dark"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除图标 -->
            <el-tooltip
              transition="none"
              content="删除"
              placement="top"
              effect="dark"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removueUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 权限管理图标 -->
            <el-tooltip
              transition="none"
              content="权限管理"
              placement="top"
              effect="dark"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click=""
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
        :pager-count="7">
      </el-pagination>
    </el-card>
    <!-- 添加用户表单 -->
    <el-dialog
      @close="addDialogClosed"
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        :model="addform"
        ref="addform"
        :rules="addformrules"
        label-width="70px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password" type="password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户表单 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="EditdialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editformrules"
        label-width="70px"
        :inline="false"
        size="normal"
        ref="editForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled=""></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

 
<script>
import request from "@/utils/request";
export default {
  data() {
    var mobileCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机！"));
      } else if (value.length !== 11) {
        callback(new Error("手机号码格式错误！"));
      } else callback();
    };

    return {
      editForm: [],
      addform: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editformrules: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确！", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机不能为空", trigger: "blur" },
          { validator: mobileCheck, trigger: "blur" },
        ],
      },
      addformrules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6-15个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码的长度在6-15个字符之间",
            trigger: "blur",
          },
        ],

        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确！", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机不能为空", trigger: "blur" },
          { validator: mobileCheck, trigger: "blur" },
        ],
      },

      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,

      dialogVisible: false,
      EditdialogVisible: false,
    };
  },

  created() {
    this.getUserList();
  },

  methods: {
    ifstastus(state) {
      if (state != 200) return this.$message.error("请求失败");
    },
    showEditDialog(id) {
      return request.get("users/" + id).then((res) => {
        // console.log(res);
        this.ifstastus(res.status);
        this.editForm = res.data.data;
        this.EditdialogVisible = true;
        // console.log(this.editForm);
      });
    },
    addUser() {
      this.$refs.addform.validate((valid) => {
        if (!valid) return;
        request.post("users", this.addform).then((res) => {
          console.log(res);

          if (res.status == 200) {
            this.$message.success("添加成功");
            this.dialogVisible = false;
            this.getUserList();
          } else this.$message.success("添加失败");
        });
      });
    },
    editUser() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return;
        request.put("users/" + this.editForm.id, 
        {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        }).then((res) => {
          // console.log(res)
          this.ifstastus(res.status)
          this.EditdialogVisible=false
          this.getUserList()
          this.$message.success('更新成功')
    
        })
      })
    },
    removueUser(id){
      // console.log(id);
          this.$confirm('真的要删除此用户吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          request.delete('users/'+id).then(res=>{
            // console.log(res);
            
                this.ifstastus(res.status)
                 this.$message.success('删除成功！')
                 this.getUserList()

          })
       
        }).catch(()=>{
         
        })
  
      
    }
    ,
    addDialogClosed() {
      this.$refs.addform.resetFields();
    },
    editDialogClosed() {
      this.$refs.editForm.resetFields();
    },
    getUserList() {
      request.get("users", { params: this.queryInfo }).then((res) => {
        //  console.log(res);
        if (res.status !== 200) return this.$message.error("获取用户列表失败");
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
        // console.log(this.userList);
        //  console.log(this.total);
      });
    },
    sizeChange(newsize) {
      // console.log(newsize);
      this.queryInfo.pagesize = newsize;
      this.getUserList();
    },
    stateChange(userinfo) {
      request
        .put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then((res) => {
          console.log(res);
          if (res.status !== 200) {
            this.$message.error("请求失败！");
            userinfo.mg_state = !userinfo.mg_state;
          }
        });
    },
    currentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
  },
};
</script>
<style  scoped>
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
</style>