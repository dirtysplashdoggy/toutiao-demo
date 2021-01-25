<template>
  <div class="bcc">
    <el-container class="home-container">
      <el-header>
        <div>
          <span>后台管理</span>
        </div>
        <el-button class="quit" type="info" @click="logout"> 退出</el-button></el-header
      >
      <el-container>
        <el-aside :width="isFlag ? '64px': '200px'">
           <div class="button1" @click="toggleiscollapse">|||</div>
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            :collapse = "isFlag"
            :collapse-transition = "false"
            :default-active ='$route.path'
            router
          >

            <el-submenu :index="item.id.toString() " v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>

              <el-menu-item :index="'/'+subitem.path" v-for="(subitem, index) in item.children" :key="subitem.id">
                <template slot="title">
                  <i class="el-icon-caret-right"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <!-- router-view -->
            <router-view></router-view>
          </el-main>
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
      isFlag : false,
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

    toggleiscollapse(){
      this.isFlag = !this.isFlag
    },
    getMenuList(){
      request.get('menus').then(res =>{
        // console.log(res);
        if(res.data.data == null) return this.$message.error(res.data.meta.msg)
        this.menulist=res.data.data
        // console.log(this.menulist);
        
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

.button1{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #eaedf1;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.home-container {
  height: 100%;
}
.quit{
  position: fixed;
  right: 20px;
}

.el-menu{
 border-right:0
}

.bcc{
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
