

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


// 修改内容
$('#replace_cmd').click(() => {
	const replaceData = $('#example').val();
	const targetData = $('#example2').val();
	const isChecked = $('#four').prop('checked')
	sendMessageToContentScript({cmd:'replace_cmd', size: 42, replaceData, targetData, isChecked}, function(response){
		if(response.result) {
			chrome.notifications.create(null, {
				type: 'image',
				iconUrl: 'img/icon.png',
				title: '查询',
				message: `一共找到${response.length}处替换地方`,
				imageUrl: 'img/icon.png'
			});
		}
	});
});


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