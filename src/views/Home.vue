<template>
  <div>
    <el-container class="home-container">
      <el-header>
        <div>
          <span>后台管理</span>
        </div>
        <el-button type="info" @click="logout"> 退出</el-button></el-header
      >
      <el-container>
        <el-aside width="200px">
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
          
          >

            <el-submenu :index="item.id.toString() " v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>

              <el-menu-item :index='subitem.id.toString()' v-for="(subitem, index) in item.children" :key="subitem.id">
                <template slot="title">
                  <i class="el-icon-caret-right"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>Main</el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  data(){
    return{
      menulist:[],
      iconObj:{
        '125':'el-icon-user',
        '103':'el-icon-setting',
        '101':'el-icon-goods',
        '102':'el-icon-tickets',
        '145':'el-icon-data-line',
      }
    }
  },
  name: "Home",
  components: {},
  methods: {
    getMenuList(){
      request.get('menus').then(res =>{
        // console.log(res);
        if(res.data.data == null) return this.$message.error(res.data.meta.msg)
        this.menulist=res.data.data
        console.log(this.menulist);
        
      })
    },


    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
  created(){
    this.getMenuList()
  }
};
</script>


<style scoped>
.home-container {
  height: 100%;
}

.el-menu{
 border-right:0
}

div {
  height: 100%;
  display: flex;
  align-items: center;
}
span {
  padding-left: 30px;
}

.el-header {
  background-color: #373d41;
  /* background-color: #a1e07d; */
  display: flex;
  color: #eaedf1;
  font-size: 20px;
  align-items: center;
}

.el-aside {
  background-color: #545c64;
}

.el-main {
  background-color: #eaedf1;
}
</style>
