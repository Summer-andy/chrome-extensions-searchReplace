
// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	if(request.cmd == 'replace_cmd') {
		let str = document.body.innerHTML;
		const replaceData = request.replaceData;  // 被替换的内容
		const targetData = request.targetData; // 替换的内容
		
		var container = document.body

		var regex = RegExp(replaceData, 'gi');
		const instance =  findAndReplaceDOMText(container, {
			find: regex,
			replace: function(portion, match) {
				called = true;
				// var el = document.createElement('span');
				// el.innerHTML = targetData;
				return targetData;
			},
			forceContext: findAndReplaceDOMText.NON_INLINE_PROSE
		});
		sendResponse({ result: true, length: instance.reverts.length })
	}
	else {
		sendResponse({ result: true, length: 0 })
		console.log('待处理');
	}
});
