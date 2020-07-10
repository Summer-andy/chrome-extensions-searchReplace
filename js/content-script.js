
// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
	if(request.cmd == 'update_font_size') {
		let str = document.body.innerHTML;
		const replaceData = request.replaceData;
		const targetData = request.targetData;
		const isChecked = request.isChecked;
		console.log(isChecked);
		if(isChecked) {
			 str = str.replace(new RegExp(replaceData, 'g'), targetData);
		} else {
			str = str.replace(replaceData, targetData);
		}
		document.body.innerHTML = str;
	}
	else {
		tip(JSON.stringify(request));
		sendResponse('我收到你的消息了：'+JSON.stringify(request));
	}
});