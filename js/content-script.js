

// 定义匹配规则字符
const arr = ['<', '>'];

// 自定义正则
const regular = data => new RegExp(data, 'g');

// 给字符串新增replaceString方法
String.prototype.replaceString = function(index,str0,str1) {
	return this.slice(0, index) + str1 + this.slice(index + str0.length, this.length)
}


// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if(request.cmd == 'replace_cmd') {
		let str = document.body.innerHTML;
		const replaceData = request.replaceData;  // 被替换的内容
		const targetData = request.targetData; // 替换的内容
		const isChecked = request.isChecked; // 是否全文替换
		const arr = getStringArrLength(replaceData, str); // 获取匹配内容的长度
		if(isChecked) {
			for (let index = 0; index < arr; index++) {
				const idx = findStrIndex(str, replaceData, index - 1);
				if(isReplaceWord(idx, str)) {
					str = str.replaceString(idx, replaceData, targetData);
				}
			}
		} else {
			let index = 0
			while (index < arr) {
				index++
				const idx = findStrIndex(str, replaceData, index);
				if(isReplaceWord(idx, str)) {
					str = str.replaceString(idx, replaceData, targetData);
					break;
				}
			}
		}
		document.body.innerHTML = str;
	}
	else {
		console.log('待处理');
	}
});

/**
* 判断此字符是否可替换
* @params {number} idx -  匹配字符下标
* @params {string} - 模板字符串
* @return {Boolean} - 字符是否可替换
*/
function isReplaceWord(idx, str) {
	return getBefore(idx, str) && getBefore(idx, str).isText && getAfter(idx, str) && getAfter(idx, str).isText
}

/**
* 指定某个字符串某个次数的索引值
* @params {string} str - 源模板
* @params {string} cha - 匹配的字符串
* @params {number} num - 匹配的位置
* @return {number} 匹配的索引值
*/

function findStrIndex(str, cha, num) {
	var x = str.indexOf(cha);
	for (var i = 0; i < num; i++) {
			x = str.indexOf(cha, x + 1);
	}
	return x;
}


/**
* 获取当前页面所有的匹配字符的数组长度
* @params {number | string} str1 -  目标字符串
* @params {number | string} str2 - 模板字符串
* @return {number} 匹配下标数组长度
*/

function getStringArrLength(str1, str2) {
	 return str2.match(regular(str1)) ? str2.match(regular(str1)).length : 0;
}

/**
* 获取当前字符头部标签
* @params {number } idx -  索引
* @params {string} str -  目标字符串
* @return {object} 是否是可替换文本
*/
function getBefore(idx, str) {
	for (let index = idx; index >= 0; index--) {
		if(str[index] === arr[0]) {
			return  { isText: false }
		}
		else if(str[index] === arr[1]) {
			return { isText: true }
		} 
	}
}


/**
* 获取当前字符后尾部标签
* @params {number } idx -  索引
* @params {string} str -  目标字符串
* @return {object} 是否是可替换文本
*/

function getAfter(idx, str) {
	for (let index = idx; index < str.length; index++) {
		if(str[index] === arr[1]) {
			return  { isText: false }
		}
		if(str[index] === arr[0]) {
			return { isText: true }
		}
	}
}
