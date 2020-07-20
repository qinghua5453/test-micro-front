<template>
	<el-menu :default-active="onRoutes" class="menu" @select="handleSelect">
		<div v-for="(item,index) in menu" :key="index">
			<el-submenu :index="item.name" v-if="item.nodes && item.nodes.length > 0">
				<template slot="title">
					<svg class="icon" aria-hidden="true">
						<use :xlink:href="item.icon"></use>
					</svg>
					{{ item.name }}
				</template>
				<el-menu-item-group v-for="node in item.nodes" :key="node.menuId">
					<el-menu-item :index="node.url">{{ node.name }}</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<el-menu-item :index="item.url" v-else>
				<svg class="icon" aria-hidden="true">
					<use :xlink:href="11"></use>
				</svg>
				{{ item.name }}
			</el-menu-item>
		</div>
	</el-menu>
</template>


<script>
import moment from "moment";

export default {
  name: "component-menu",
  data() {
    return {};
  },
  methods: {
    handleSelect(index) {
      // 订单列表默认显示今天数据
      if (index == "order") {
        index =
          index +
          "?startTime=" +
          moment().format("YYYY-MM-DD 00:00:00") +
          "&endTime=" +
          moment().format("YYYY-MM-DD 23:59:59");
      }
      console.log('index', index)
      console.log('location.origin', location.origin)
      this.$router.push({
        path: index
      })
      // window.location.href = location.origin + "/" + index;
    }
  },
  computed: {
    onRoutes() {
      if (this.$route.matched.length === 3) {
        //子路由
        return this.$route.matched[1].path.replace("/", "");
      } else {
        return this.$route.path.replace("/", "");
      }
    },
    menu() {
      return this.$store.state.user.menu;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
// 组件的样式写这里
.menu {
  .el-aside {
    color: #333;
    .el-submenu .el-menu-item {
      min-width: 0;
      padding: 0 20px;
    }
    .el-menu-item.is-active {
      background: #409eff;
      border-radius: 20px;
      color: #fff;
      padding: 0;
      min-width: 0;
    }
  }
  .iconfont {
    padding-right: 5px;
  }
}
</style>
