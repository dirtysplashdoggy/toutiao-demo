<!--  -->
<template>
  <div class="login-container">
    <el-row style="padding-top: 275px">
      <el-col :span="5" :offset="9">
        <el-card shadow="always">
          <el-form
            style="
              padding-top: 20px;
              padding-right: 20px;
              margin-left: -35px;
              margin-bottom: -10px;
            "
            :model="user"
            status-icon
            ref="loginFormRef"
            label-width="100px"
            :rules="rules"
          >
            <el-form-item label="账号" prop="username">
              <el-input
                prefix-icon="el-icon-user"
                v-model="user.username"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                prefix-icon="el-icon-lock"
                type="password"
                v-model="user.password"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="login">提交</el-button>
              <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        username: 'admin',
        password: '123456',
      },

      rules: {
        username: [
          { required: true, message: '请输入账号！', tirgger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符', tirgger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码！', tirgger: 'blur' },
        ],
      },
    }
  },
  methods: {
    resetLoginForm() {
      //   console.log(this);
      this.$refs.loginFormRef.resetFields()
    },

    login() {
      this.$refs.loginFormRef.validate((valid) => {
        if (!valid) return
        request.post('login', this.user).then((res) => {
          //   console.log(res.data);
          if (res.data.meta.status != 200) {
            return this.$message.error('账号或密码错误！')
          }
          this.$message.success('登陆成功！')
          console.log(res.data)
          window.sessionStorage.setItem('token', res.data.data.token)
          this.$router.push('/home')
        })
      })
    },
  },
}
</script>
<style scoped>
.login-container {
  background-color: #b1cbd6b6;
  height: 100%;
}
</style>