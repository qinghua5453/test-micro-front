<template>
	<el-menu :default-active="onRoutes" class="menu" @select="handleSelect">
		<div v-for="(item,index) in menu" :key="index">
      <div v-if="nums.indexOf(item.orderNum) >= 0" class="lineItme">
      </div>
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
    return {
    };
  },
  methods: {
    checkShow(arr,num) {
      console.log(arr);
      console.log(num);
    },
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
      // window.location.href = location.origin + "/" + index;
      this.$router.push({
        path: index
      })
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
    nums() {
      let menus = this.$store.state.user.menu;
      let menusNum = [];
      let checkNum = [];
      let finalNum = [];
      for (let i = 0; i < menus.length; i++) {
        const element = menus[i];
        if (element.orderNum) {
          menusNum.push(element.orderNum);
          checkNum.push(parseInt(element.orderNum/20));
        }
      }
      for (let i = 0; i < checkNum.length; i++) {
        const element = checkNum[i];
        if (i == 0) {
          finalNum.push(menusNum[i]);
        } else {
          if (element != checkNum[i-1]) {
            finalNum.push(menusNum[i]);
          }
        }
      }
      return finalNum;
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
  .lineItme  {
    // margin-top: 30px;
    background: #ececec;
    height: 1px;
    margin-left: 50px;
  }
}
</style>
