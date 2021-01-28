<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 获取列表 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <el-row>
        <el-col :span="12" :offset="0">
          <el-button type="primary" size="default" @click="getPaientCateList"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表单TREE内容 -->
      <el-table
        :data="catelist"
        row-key="cat_id"
        stripe
        default-expand-all
        border
        style="margin-top: 15px"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="cat_name" label="分类" sortable width="300">
        </el-table-column>

        <el-table-column prop="cat_deleted" label="是否有效" width="100">
          <template v-slot="scope">
            <i
              class="el-icon-success"
              style="color: #67c23a"
              v-if="scope.row.cat_deleted === false"
            />
            <i class="el-icon-error" style="color: #f56c6c" v-else />
          </template>
        </el-table-column>

        <el-table-column prop="cat_level" label="排序" width="100">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag type="warning" v-if="scope.row.cat_level == 1">二级</el-tag>
            <el-tag type="info" v-if="scope.row.cat_level == 2">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="5"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close=""
    >
      <el-form
        :model="AddCateForm"
        ref="AddCateForm"
        :rules="AddCateRules"
        label-width="80px"
        :inline="false"
        size="normal"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="AddCateForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类">
          <!--    options="parentCateList 数据源
                    :props="cascaderProps" 配置对象
              -->
          <el-cascader
            clearable
            v-model="selectedOption"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: true,
            }"
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="cancelAddcateformDialog">取消</el-button>
        <el-button type="primary" @click="addCate"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../utils/request";
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10,
      },
      treeProps: {
        label: "cat_name",
        children: "children",
      },
      catelist: [],
      total: 0,
      addCateDialogVisible: false,
      AddCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      AddCateRules: {
        cat_name: [
          { required: true, message: "请输入分类！", trigger: "blur" },
        ],
      },
      parentCateList: [],
      selectedOption: [],
    };
  },

  created() {
    this.getCateList();
  },

  methods: {
    getCateList() {
      request.get(`categories`, { params: this.queryInfo }).then((res) => {
        console.log(res);
        this.catelist = res.data.data.result;
        this.total = res.data.data.total;
        // console.log(this.catelist);
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDialog() {
      this.addCateDialogVisible = true;
    },
    getPaientCateList() {
      this.addCateDialogVisible = true;
      request.get("categories", { params: { type: 2 } }).then((res) => {
        this.parentCateList = res.data.data;
        // console.log(res);
      });
    },
    parentCateChanged() {
      console.log(this.selectedOption);
      if (this.selectedOption.length > 0) {
        this.AddCateForm.cat_pid = this.selectedOption[this.selectedOption.length - 1];
        this.AddCateForm.cat_level = this.selectedOption.length;
        return;
      } else {
        this.AddCateForm.cat_pid = 0;
        this.AddCateForm.cat_level = 0;
      }
    },
    addCate(){
      this.$refs.AddCateForm.validate(valide =>{
        if(!valide) return
        request.post('categories',this.AddCateForm).then(res=>{
          console.log(res);
          this.getCateList()
          
        })
      })
      this.addCateDialogVisible=false
      // console.log(this.AddCateForm); 

    
    },
    cancelAddcateformDialog(){
    
    
        this.addCateDialogVisible=false
        this.$refs.AddCateForm.resetFields()
        this.selectedOption=[]
        this.AddCateForm.cat_level=0
        this.AddCateForm.cat_pid=0
    }
  },
};
</script>
<style  scoped>
.el-cascader {
  width: 100%;
}
</style>