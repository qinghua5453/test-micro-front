<template>
	<section class="form_contianer">
		<h3>修改密码</h3>
		<el-form class="loginForm" :rules="changepwdRule" ref="AccountFrom" :model="account">
			<el-form-item prop="password">
				<el-input type="password" clearable size="small" placeholder="原密码" v-model="account.password">
				</el-input>
			</el-form-item>
			<el-form-item prop="newPassword">
				<el-input type="password" clearable size="small" placeholder="新密码" v-model="account.newPassword">
				</el-input>
			</el-form-item>
			<el-form-item prop="confirmPwd">
				<el-input type="password" clearable size="small" placeholder="确认密码" v-model="account.confirmPwd" @keyup.enter.native="handleChangePwd">
				</el-input>
			</el-form-item>
		</el-form>
		<div class="login-warpper" @click="handleChangePwd">
			<label>确 &nbsp;定</label>
			<label class="eng-des">DETERMNE</label>
		</div>
	</section>
</template>

<script>
import Api from "@/utils/Api";
import User from "@/utils/User";
export default {
  data() {
    var checkConfirmPwd = (rule, value, callback) => {
      if (value != this.account.newPassword) {
        return callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    var checkNewPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else if (value == this.account.password) {
        return callback(new Error("新密码不能与原密码相同"));
      } else {
        callback();
      }
    };
    return {
      account: {
        password: null,
        newPassword: null,
        confirmPwd: null
      },
      changepwdRule: {
        password: [
          {
            required: true,
            message: "请输入原始密码",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            validator: checkNewPassword,
            trigger: "blur"
          }
        ],
        confirmPwd: [
          {
            required: true,
            message: "确认密码不能为空",
            trigger: "blur"
          },
          {
            validator: checkConfirmPwd,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 修改密码
    handleChangePwd() {
      this.$refs.AccountFrom.validate(valid => {
        if (valid) {
          this.$axios
            .post(Api.USER_CHANGE_PWD, {
              password: this.account.password,
              newPassword: this.account.newPassword
            })
            .then(_ => {
              this.$message({
                showClose: true,
                message: "修改密码成功！",
                type: "success"
              });
              let path = this.$route.params.return || "/login";
              this.$router.push(path);
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
h3 {
  width: 120px;
  height: 42px;
  font-size: 30px;
  font-family: PingFangSC-Regular;
  color: rgba(12, 164, 233, 1);
  line-height: 42px;
  margin: 0 auto 60px;
}

.login-warpper {
  .eng-des {
    font-size: 11px;
    margin-top: 3px;
  }
}
.loginForm {
  .el-form-item {
    margin: 20px 0;
  }
}
</style>
