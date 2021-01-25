<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == '0'">一级</el-tag>
            <el-tag v-if="scope.row.level == '1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level == '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      rightList: [],
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
      request.get("rights/list").then((res) => {
        // console.log(res);
        this.ifReturnSuccess(res.data.meta.status);
        this.rightList = res.data.data;
        console.log(this.rightList);
      });
    },
  },
};
</script>

<style scoped>
</style>