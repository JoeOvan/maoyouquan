import Vue from 'vue'

Vue.filter('formatData', (date) => {
		
	if(!date) return;
	
	let splitDate = date.split(" ");
	let tempDate = splitDate[0];
	let tempTime = splitDate[1];
	
	const temp = [];
	for (let i = 0; i < 7; i++) {
		
		const time = new Date(new Date().setDate((new Date().getDate() + i)));
		const year = time.getFullYear();
		const month = `0${time.getMonth() + 1}`.slice(-2);
		const day = `0${time.getDate()}`.slice(-2);
		temp.push(`${year}-${month}-${day}`);
	}
	 
	let dateIndex = temp.findIndex(item => item == tempDate);
	
	let strDate = '';
	if(dateIndex == 0) {
		strDate = '今天 ' + tempTime;
	} else if (dateIndex == 1) {
		strDate = '明天 ' + tempTime;
	} else if (dateIndex == 2) {
		strDate = '后天 ' + tempTime;
	} else {
		// strDate = date;
		strDate = tempDate.slice(-2) + '日 ' + tempTime;
	}
	
	
	return strDate;

})

Vue.filter('transformGender', (gender) => {
	// if(!gender) return;
	
	let strGender = '';
	if(gender == 0) {
		strGender = '不限';
	} else if (gender == 1) {
		strGender = '男';
	} else if (gender == 2) {
		strGender = '女';
	}
	// console.log(strGender);
	return strGender;
})

Vue.filter('transformGenderMine', (gender) => {
	// if(!gender) return;
	
	let strGender = '';
	if(gender == 0) {
		strGender = '未知';
	} else if (gender == 1) {
		strGender = '男';
	} else if (gender == 2) {
		strGender = '女';
	}
	// console.log(strGender);
	return strGender;
})

Vue.filter('transformAge', (age) => {
	// if(!age) return;
	
	let strAge = '';
	if(age == 1) {
		strAge = '18-25岁';
	} else if (age == 2) {
		strAge = '25-30岁';
	} else if (age == 3) {
		strAge = '30-35岁';
	} else if (age == 4) {
		strAge = '35-40岁';
	} else if (age == 5) {
		strAge = '40-45岁';
	} else if (age == 6) {
		strAge = '45-50岁';
	} else if (age == 7) {
		strAge = '50岁以上';
	} else if (age == 8) {
		strAge = '不限';
	}
	return strAge;
})

Vue.filter('transformPay', (way) => {
	
	let strWay = '';
	if(way == 0) {
		strWay = 'AA制';
	} else if (way == 1) {
		strWay = '邀约方全包';
	} else if (way == 2) {
		strWay = '应邀方全包';
	} else if (way == 3) {
		strWay = '其他';
	}
	return strWay;
})

Vue.filter('transformDistance', (distance) => {
	
	

	var n=''
	if(distance){
		if (distance >= 1) {
			n = distance.toFixed(1) + 'km'
		} else {
			n = distance * 1000 + 'm'
		}
	} else {
		n = '0m'
	}
	
	return n
	
})