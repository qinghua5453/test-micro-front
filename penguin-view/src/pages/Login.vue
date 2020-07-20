<template>
  <section class="form_contianer">
    <h3 class="title">企鹅运营管理平台</h3>
    <el-form
      class="loginForm"
      ref="AccountFrom"
      :model="account"
      :rules="rules"
    >
      <el-form-item prop="username">
        <el-input
          clearable
          placeholder="请输入用户名"
          v-model="account.username"
        >
          <i slot="prefix" class="el-input__icon iconfont icon-yonghu"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input
          clearable
          size="small"
          v-model="account.pwd"
          placeholder="请输入密码"
          type="password"
          @keyup.enter.native="handleLogin"
        >
          <i slot="prefix" class="el-input__icon iconfont icon-mima"></i>
        </el-input>
      </el-form-item>
      <span class="forget-pwd" @click="forgetPwd">忘记密码?</span>
    </el-form>
    <div class="login-warpper" @click="handleLogin">
      <label>登&nbsp;录</label> <label>LOGIN</label>
    </div>
  </section>
</template>
<script>
import Api from "@/utils/Api";
import User from "@/utils/User";
export default {
  data() {
    return {
      logining: false,
      account: {
        username: "",
        pwd: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        pwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      checked: true
    };
  },
  methods: {
    handleLogin() {
      this.$refs.AccountFrom.validate(valid => {
        if (valid) {
          this.$axios
            .post(Api.LOGIN, {
              username: this.account.username,
              password: this.account.pwd
            })
            .then(resp => {
              User.setToken(resp.token);
              User.setData(resp.user);
              let path = this.$route.params.return || "/home";
              this.$router.push(path);
            });
        }
      });
    },
    forgetPwd() {
      this.$router.push("/password");
    }
  }
};
</script>
<style lang="less" scoped>
.title {
  width: 296px;
  height: 46px;
  margin: 0 auto 60px;
  font-size: 37px;
  font-family: MFYueYuan_Noncommercial-Regular;
  color: rgba(0, 160, 232, 1);
  line-height: 46px;
}
.login-warpper {
  label {
    font-size: 16px;
  }
}
.loginForm .iconfont {
  padding-left: 14px;
}
</style>
