<template>
   <div>
    <button @click="show">show picker</button>
    <VuePicker :data="pickData"
      :layer="3"
      :showToolbar="true"
      :defaultIndex="defaultIndex"
      @cancel="cancel"
      @confirm="confirm"
      @change="change"
      :visible.sync="pickerVisible"
    />
  </div>
</template>

<script>
import VuePicker from 'vue-pickers'
// import date from '../json/date.js'
// import days from '../json/days.js'
// let _list, hours = [], mins = [];
//      _list = date.dayList[0]

//      _list.hourList.map((item, index) => {
//       hours.push({
//         label: item.name,
//         value: index
//       })
//     })
//     _list.hourList[0].minuteList.map((item, index) => {
//       mins.push({
//         label: item.name,
//         value: index
//       })
//     })
import tdata from '../json/city.js'
import date from '../json/date.js'
let pickData = []
date.dayList.map((item, index) => {
  let obj = {
    label: item.name,
    value: item.value,
    children: []
  }

  item.hourList.map((val, i) => {
    obj.children.push({
      label: val.name,
      value: val.value,
      children: []
    })

    val.minuteList.map((el, j) => {
      obj.children[i].children.push({
        label: el.name,
        value: el.value
      })
    })
  })
  pickData.push(obj)
})

console.log('pickData', pickData)

export default {
  name: 'test-picker',

  components: {
    VuePicker
  },

  data () { 
    return {
       pickerVisible: false,
        pickData: pickData,
        defaultIndex: [0, 0, 0],
        result: '',
   }
  },

  methods: {
    show () {
      this.pickerVisible = true
    },
    change(e) {
      // console.log('e', e)
      // if (!this.isTriggerChange) return
      // console.log('e', e)
      // let values = []
      // e.map((item, index) => {
      //   console.log('item', item)
      //   values.push(item.value)
      // })
      // if (values.length === 1) return
      // console.log('values', values)

      // let activeHourArr = date.dayList.filter(
      //   (item, index) => {
      //     // console.log('item', item)
      //     return index == values[0];
      //   }
      // );
      // console.log('activeHourArr[0].hourList', activeHourArr)

      // if (activeHourArr.length) {
      //  // 更新时间 小时
      //   let hours = []
      //   activeHourArr[0].hourList.map((item, index) => {
      //     hours.push({
      //       label: item.name,
      //       value: index
      //     })
      //   })
        
      //   // 更新分钟
      //   let mins = []
      //   let activeMinArr = activeHourArr[0].hourList.filter((item, index) => {
      //     return index === values[1]
      //   })

      //   activeMinArr[0].minuteList.map((item, index) => {
      //     mins.push({
      //       label: item.name,
      //       value: index
      //     })
      //   })
        
      //   // this.pickData.splice(0, 1, days)
      //   // this.pickData.splice(1, 1, hours)
      //   // this.pickData.splice(2, 1, mins)
      //   // this.pickData = [days, hours, mins]
      //   console.log('activeMinArr', activeMinArr)
      //   console.log('hours', hours)
      //   console.log('mins', mins)
      // }
      // this.pickData[1] = []
      // this.pickData[1] = activeHourArr[0].hourList

      // 更新时间 分钟
      // let activeMinArr = this.machineTimeData.hourList.filter(
      //   (item, index) => {
      //     return index == value[1];
      //   }
      // );
      // if (activeMinArr.length) {
      //   this.setData({
      //     'machineTimeData.minuteList': activeMinArr[0].minuteList,
      //   });
      // }

    },
    cancel () {
        this.result = 'click cancel result: null'
      },
      confirm (res) {
        this.result = JSON.stringify(res)
      }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
