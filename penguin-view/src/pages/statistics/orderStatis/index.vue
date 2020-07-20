<template>
    <section>
        <q-breadcrumb :data="['数据统计','订单数据统计']" />
         <div class="tabs_header">
            <router-link v-if="getPerm('statis:listValidOrder')" exact-active-class="active" :to="{name:'firmorderStatis'}">有效订单统计</router-link>
            <router-link v-if="getPerm('statis:listNewValidOrder')" exact-active-class="active" :to="{name:'newuserorderStatis'}">新用户订单统计</router-link>
            <router-link v-if="getPerm('statis:listAreaValidOrder')" exact-active-class="active" :to="{name:'areaStatis'}">区域订单统计</router-link>
            <router-link v-if="getPerm('statis:listPayTypeOrder')" exact-active-class="active" :to="{name:'paymentStatis'}">订单支付方式统计</router-link>
            <router-link v-if="getPerm('statis:listRefundCompensateOrder')" exact-active-class="active" :to="{name:'refundStatis'}">退款/补偿订单统计</router-link>
            <router-link v-if="getPerm('statis:listRefundCompensateOrder')" exact-active-class="active" :to="{name:'liquid'}">洗衣液订单统计</router-link>
        </div>
        <router-view></router-view>
    </section>
</template>

<script type='text/ecmascript-6'>
import { mapGetters, mapState } from "vuex";
import QBreadcrumb from "@/components/Breadcrumb";
export default {
  components: {
    QBreadcrumb
  },
  data() {
    return {};
  },
  created() {
    // 拿到用户二级菜单的第一个菜单
    let pmenu = this.findfristurl(this.menu, "数据统计");
    let secondMenu = this.findfristurl(pmenu, "订单统计");
    let path = secondMenu.length > 0 ? secondMenu[0].url : "";
    if (this.$route.matched.length === 2 && path) {
      //根据分配的权限展示第一个子路由
      this.$router.push(path);
    }
  },
  methods: {
    findfristurl(list, name) {
      let secondMenu = [];
      list.map(item => {
        if (item.name === name) {
          secondMenu = secondMenu.concat(item.nodes);
        }
      });
      return secondMenu;
    }
  },
  computed: {
    ...mapGetters("user", ["getPerm"]),
    ...mapState("user", {
      // 一级类列表
      menu: state => state.menu
    })
  }
};
</script>
<style lang='less' scoped type='text/css'>
.tabs_header {
  width: 100%;
  background: #f5f7fa;
  height: 40px;
  border-bottom: 1px solid #e4e7ed;
  > a {
    padding: 0 20px;
    height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #909399;
    position: relative;
    -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    border: 1px solid transparent;
    margin: 0px -1px 0;
  }
  .active {
    color: #409eff;
    background-color: #fff;
    border-right-color: #dcdfe6;
    border-left-color: #dcdfe6;
  }
}
</style>
