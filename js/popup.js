
var searchInput = document.getElementById('example');

function debounce(func,wait,immediate) {
	let timeout;
	return function () {
			let context = this;
			let args = arguments;

			if (timeout) clearTimeout(timeout); 
			if (immediate) {
					var callNow = !timeout;
					timeout = setTimeout(() => {
							timeout = null; 
					}, wait)
					if (callNow) func.apply(context, args)
			}
			else {
					timeout = setTimeout(function(){ 
							func.apply(context, args)
					}, wait);
			}
	}
}

// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback)
{
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.sendMessage(tabId, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}


function inputHandler() {
	const replaceData = $('#example').val();
	sendMessageToContentScript({  cmd : 'search_cmd', replaceData }, function(response) {
		if(response && response.result) {
			chrome.notifications.create(null, {
				type: 'image',
				iconUrl: 'img/find.png',
				title: '查询',
				message: `一共找到${response.length}处替换地方`,
				imageUrl: 'img/find.png'
			});
		}
	})
}


// 修改内容
$('#replace_cmd').click(() => {
	const replaceData = $('#example').val();
	const targetData = $('#example2').val();
	sendMessageToContentScript({cmd:'replace_cmd', replaceData, targetData }, function(response){
		if( response && response.result) {
			chrome.notifications.create(null, {
				type: 'image',
				iconUrl: 'img/summer.png',
				title: '查询',
				message: `一共替换了${response.length}处地方`,
				imageUrl: 'img/summer.png'
			});
		}
	});
});


$('#clear_cmd').click(() => {
	if($('#example').val() !== '' || $('#example2').val() !== '') {
		$('#example').val("");
		$('#example2').val("");
		chrome.notifications.create(null, {
			type: 'image',
			iconUrl: 'img/summer.png',
			title: '清空提示',
			message: '已清空输入框内容',
			imageUrl: 'img/summer.png'
		});
	}
})


var animateButton = function(e) {
  e.preventDefault;
  e.target.classList.remove('animate');
  e.target.classList.add('animate');
  setTimeout(function(){
    e.target.classList.remove('animate');
  },300);
};

var classname = document.getElementsByClassName("bubbly-button");

for (var i = 0; i < classname.length; i++) {
  classname[i].addEventListener('click', animateButton, false);
}

searchInput.onchange = function() {
	debounce(inputHandler(), 500);
};



