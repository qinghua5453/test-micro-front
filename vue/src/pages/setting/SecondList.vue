<template slot-scope="scope">
  <section v-if="getPerm('dal:machineTypeSeconds:list')">
    <!-- 面包屑导航 -->
    <q-breadcrumb :data="['设置', '二级类型']" />
    <div class="earing-page">
      <div class="report-tab">
        <span v-for="(item,index) in tabTitle" :key="index" @click="tabChange(item.component,index)" :class="{active:index==num}">{{item.title}}</span>
        <router-link tag="span" to="model/list" >型号管理(新二级类型)</router-link>
      </div>
      <component :is="currentView"></component>
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex';
import oldSecondListComponent from './oldSecondListComponent';

import sendCmd from './sendCmd';
import QBreadcrumb from '@/components/Breadcrumb';
export default {
  data() {
    return {
      currentView: 'oldSecondListComponent', // 默认选中第一项
      num: 0,
      tabTitle: [{ component: oldSecondListComponent, title: '二级类型' }, { component: sendCmd, title: '发送指令' }]
    };
  },
  components: {
    oldSecondListComponent,
    sendCmd,
    QBreadcrumb
  },
  computed: {
    ...mapGetters('user', ['getPerm'])
  },
  methods: {
    tabChange(tabItem, index) {
      this.currentView = tabItem;
      this.num = index;
      let query = {};
      query['t'] = +new Date();
      this.$router.push({
        query: query
      });
    }
  }
};
</script>
<style lang="less" scoped>
.earing-page {
  background: #fff;
  padding: 16px 32px 32px 32px;
  .report-tab {
    padding-bottom: 11px;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 30px;
    span {
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      line-height: 22px;
      margin-right: 44px;
      padding-bottom: 11px;
    }
    .active {
      color: #409eff;
      border-bottom: 2px solid #409eff;
    }
  }
}
</style>
