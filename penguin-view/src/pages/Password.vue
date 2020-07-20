<template>
	<section class="form_contianer">
		<h3 style="margin: 0 auto;">忘记密码</h3>
		<el-form class="loginForm" ref="AccountFrom" :rules="changepwdRule" :model="account">
			<el-form-item prop="phone">
				<el-input clearable placeholder="请输入用户名" v-model="account.phone">
					<i slot="prefix" class="el-input__icon iconfont icon-yonghu"></i>
				</el-input>
			</el-form-item>
			<el-form-item prop="code">
				<el-input v-model="account.code" clearable size="small" placeholder="请输入验证码">
					<i slot="prefix" class="el-input__icon iconfont icon-yanzhengma"></i>
				</el-input>
				<div class="btn-getcode" v-show="isShowgetCode" @click="getCode">获取验证码</div>
				<div class="btn-getcode" v-show="!isShowgetCode">{{count}} s</div>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" clearable size="small" placeholder="请输入新密码" v-model="account.password">
					<i slot="prefix" class="el-input__icon iconfont icon-mima"></i>
				</el-input>
			</el-form-item>
			<el-form-item prop="confimPwd">
				<el-input type="password" clearable size="small" placeholder="请再次输入新密码" v-model="account.confimPwd" @keyup.enter.native="handlePassword">
					<i slot="prefix" class="el-input__icon iconfont icon-mima"></i>
				</el-input>
			</el-form-item>
		</el-form>
		<div class="login-warpper" @click="handlePassword">
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
    var checkPwd = (rule, value, callback) => {
      if (value != this.account.password) {
        return callback(new Error("两次密码输入不一致"));
      } else {
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      var partten = /^(13[0-9]|14[0-9]|15[0-9]|16[6]|18[0-9]|19[6,9]|17[0-9])\d{8}$/i;
      if (!value) {
        callback(new Error("请输入手机号码"));
      } else if (!partten.test(value)) {
        callback(new Error("请输入正确的11位手机号码"));
      } else {
        callback();
      }
    };
    return {
      isShowgetCode: true,
      count: "",
      timer: null,
      account: {
        phone: null,
        code: null,
        password: null,
        confimPwd: null
      },
      changepwdRule: {
        phone: [
          {
            validator: checkPhone,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ],
        confimPwd: [
          {
            required: true,
            message: "确认密码不能为空",
            trigger: "blur"
          },
          {
            validator: checkPwd,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        return this.$axios
          .post(Api.COMMON_CODE, {
            phone: this.account.phone
          })
          .then(resp => {
            this.count = TIME_COUNT;
            this.isShowgetCode = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.isShowgetCode = true;
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000);
          });
      }
    },

    // 忘记密码
    handlePassword() {
      this.$refs.AccountFrom.validate(valid => {
        if (valid) {
          this.$axios
            .post(Api.USER_RESET, {
              phone: this.account.phone,
              password: this.account.password,
              code: this.account.code
            })
            .then(_ => {
              this.$message({
                showClose: true,
                message: "重置密码成功！",
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
.loginForm .iconfont {
  padding-left: 14px;
}
.loginForm {
  .el-form-item {
    margin: 20px 0;
  }
}
</style>
