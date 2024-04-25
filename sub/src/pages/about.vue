<template>
  <div>
     <Picker :slots="slots" @change="onValuesChange"></Picker>
  </div>
</template>

<script>

import date from '../json/date.js'
import days from '../json/days.js'
let _list, hours = [], mins = [];
     _list = date.dayList[0]

     _list.hourList.map((item, index) => {
      hours.push(item.name)
    })
    _list.hourList[0].minuteList.map((item, index) => {
      mins.push(item.name)
    })
// let hours = [10,11,12,13,14,15]
// let mins = [20,30,40,50]
export default {
  name: 'about',
  
  data () {
    return {
       slots: [
        {
          flex: 1,
          values: days,
          defaultIndex: 0
        },
        {
          flex: 1,
          values: hours,
          defaultIndex: 0
        },{
          flex: 1,
          values: mins,
          defaultIndex: 0
        }
      ]
    }
  },

  methods: {
    onValuesChange(picker, values) {
      console.log('values', values)
      let _activeHourArr = date.dayList.filter((item, index) => {
          return (item.name.indexOf(values[0].split(' ')[1]) > -1)
        }
      );

      let activeHourArr = []
      _activeHourArr[0].hourList.map((item, index) => {
        activeHourArr.push(item.name)
      })
      picker.setSlotValues(1, activeHourArr)

      var val1 = picker.getSlotValue(1)
      // var val2 = picker.getSlotValue(2)
      if (val1) {
        console.log('val1', val1)
        // console.log('val2', val2)
        picker.setSlotValue(1, val1)
      }      
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
