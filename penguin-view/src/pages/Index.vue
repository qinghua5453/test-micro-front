<template>
  <el-container>
    <!-- 顶部 -->
    <el-header>
      <div class="el-logo">
        <img src="../assets/logo.svg" alt="" class="logo">
        <span>企鹅运营管理平台</span>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yonghu1"></use>
          </svg>{{ fullName }}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="goChangePwd">修改密码</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-tuichu"></use>
      </svg>
      <span @click="handleLogout">退出</span>
    </el-header>
    <!-- main -->
    <el-container>
      <span :class="['toogle',{'el-icon-arrow-right':shrink,'el-icon-arrow-left':!shrink}]" @click="toggleClick"></span>
      <!-- 左侧菜单 -->
      <el-aside unique-opened="true" :style="{width: shrink?'0px':'200px'}">
        <q-menu />
      </el-aside>
      <!-- 主区域 -->
      <el-main :style="{marginLeft: shrink?'10px':'210px'}">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less">
.el-header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  padding: 0 30px;
  background-color: #b3c0d1;
  color: #fff;
  height: 60px;
  line-height: 60px;
  text-align: right;
  font-size: 14px;
  z-index: 999;
  .el-logo {
    float: left;
    img {
      width: 55px;
      height: 38px;
      margin-top: 11px;
    }
    span {
      vertical-align: top;
      font-size: 28px;
      font-family: MFYueYuan_Noncommercial-Regular;
      color: rgba(255, 255, 255, 1);
    }
  }
  .el-dropdown {
    margin-right: 30px;
    color: #fff;
  }
  i {
    padding-right: 10px;
  }
}
.toogle {
  position: fixed;
  left: 0px;
  top: 50%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.2);
  height: 60px;
  width: 10px;
  line-height: 60px !important;
  text-align: center;
  cursor: pointer;
  margin-top: -30px;
  font-size: 12px;
  color: #fff;
}
.el-aside {
  width: 210px;
  position: fixed;
  left: 0;
  top: 60px;
  bottom: 0;
  border-right: solid 1px #e6e6e6;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  z-index: 999;
  transition: width 0.3s;
}

.el-menu {
  border: none;
}

.el-main {
  width: 88%;
  background: #e6e6e6;
  margin-left: 210px;
  margin-top: 60px;
  transition: margin 0.3s;
}

.el-submenu .el-menu-item {
  /*margin: 0 10px 0 -2px;*/
  text-align: center;
}
</style>

<script>
import QMenu from "@/components/Menu";
import User from "@/utils/User";

export default {
  name: "layout-index",
  data () {
    return {
      fullName: User.getData("fullName"),
      shrink: false
    };
  },
  methods: {
    handleLogout () {
      this.$confirm("您确定注销该用户吗?", "提示", {
        confirmButtonText: "注销",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        User.logout();
        this.$router.push("/login");
      });
    },
    goChangePwd () {
      this.$router.push("/changepwd");
    },
    toggleClick () {
      this.shrink = !this.shrink;
    }
  },
  components: {
    QMenu
  }
};
</script>
