<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <el-button type="primary" size="default" @click="">添加角色</el-button>

      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 一级 -->
            <el-row
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag>{{ item1.authName }} </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级 -->
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{ item2.authName }} </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18" :offset="0">
                    <el-tag
                      closable
                      @close="removeRight(scope.row, item3.id)"
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click=""
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini" @click=""
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SetRightDialogVisible"
      width="50%"
      @close="defKeys=[]"
    >
      <el-tree
        show-checkbox
        default-expand-all
        :default-checked-keys="defKeys"
        :data="rightsList"
        :props="treeProps"
        node-key="id"
        ref="treeRef"
      ></el-tree>
      <span slot="footer">
        <el-button @click="SetRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="pushRights"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>











<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      defKeys: [],
      roleId:'',
      roleList: [],
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      SetRightDialogVisible: false,
    };
  },

  created() {
    this.getRightsList();
  },

  methods: {
    ifReturnSuccess(status) {
      if (status != 200) return this.$message.error("请求失败！");
    },
    getRightsList() {
      request.get("roles").then((res) => {
        // console.log(res);
        this.ifReturnSuccess(res.data.meta.status);
        this.roleList = res.data.data;
        // console.log(this.roleList);
      });
    },
    removeRight(role, rightId) {
      this.$confirm("此操作会永久删除账户权限，是否继续？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.delete(`roles/${role.id}/rights/${rightId}`).then((res) => {
            // console.log(res);
            this.ifReturnSuccess(res.data.meta.status);
            // this.getRightsList();

            role.children = res.data.data;
            //   console.log(role.children);
            this.$message.success("已成功删除！");
          });
        })
        .catch(() => {
          return this.$message.info("已取消");
        });
    },
    showSetRightDialog(role) {
        this.roleId=role.id
        // console.log(role);
        
      this.SetRightDialogVisible = true;
      request.get(`rights/tree`).then((res) => {
        this.rightsList = res.data.data;
        // console.log(this.rightsList);

        this.getLeafKey(role, this.defKeys);
      });
    },
    getLeafKey(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKey(item, arr);
        // console.log(item.authName);
      });
    },
    pushRights(){
        this.SetRightDialogVisible=false
        const keys=[
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys(),
        ]
        const idStr = keys.join(',')
        console.log(idStr);
        request.post(`roles/${this.roleId}/rights`,{rids:idStr}).then(res =>{
            this.$message.success('更新成功！')   
            this.getRightsList(),
            this.SetRightDialogVisible=false 
        })

        

    },

  },
};
</script>
<style scoped>
.el-tag {
  margin: 7px;
}

.vcenter {
  display: flex;
  align-items: center;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>