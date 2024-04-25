<template>
  <div id="app">
    <div id="nav">
     <!--  <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link> -->
      <!-- <div id="name">点我选择</div> -->
    </div>
    <router-view/>

  </div>
</template>

<script>
	import days from './json/days';
	import date from './json/date';
	// console.log('date', date)
    let _list, hours = [], mins = [];
    _list = date.dayList[0]
    // hours = _list.hourList
    // mins = _list.hourList[0].minuteList
    _list.hourList.map((item, index) => {
      hours.push({
      	text: item.name,
      	value: index + 1
      })
    })
    _list.hourList[0].minuteList.map((item, index) => {
    	mins.push({
    	  text: item.name,
    	  value: index +1
    	})
    })

// import Picker from 'better-picker'
export default {
  name: "App",
  mounted () {
    // this.init()
  },
  methods: {
  	init  () {
  		var nameEl = document.getElementById('name');
  		var picker = new Picker({
			data: [days, hours, mins],
			selectedIndex: [0, 0, 0],
			title: '我们都是小学生'
		});

		// picker.on('picker.select', function (selectedVal, selectedIndex) {
		// 	nameEl.innerText = data1[selectedIndex[0]].text + ' ' + data2[selectedIndex[1]].text + ' ' + data3[selectedIndex[2]].text;
		// })

		// picker.on('picker.change', function (index, selectedIndex) {
		// 	console.log('picker.change-selectedIndex', selectedIndex);
		// });

		// picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
		// 	console.log('picker.valuechange.selectedVal', selectedVal);
		// 	console.log('picker.valuechange.selectedIndex',selectedIndex);
		// });
    
		// nameEl.addEventListener('click', function () {
		// 	picker.show();
		// });
  	}
  }
};
</script>