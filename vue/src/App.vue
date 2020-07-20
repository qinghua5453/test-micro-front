<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="less">
@import "./css/app.less";
#app {
  min-width: 1336px;
}
</style>
