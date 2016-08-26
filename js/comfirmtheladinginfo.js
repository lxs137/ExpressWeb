
(function() {
	'use strict';
	var dialogButton = document.querySelector('#dialog_button');
	var dialog = document.querySelector('#dialog');
	if (! dialog.showModal) {
		dialogPolyfill.registerDialog(dialog);
	}
	dialogButton.addEventListener('click', function() {
		dialog.showModal();
	});
	dialog.querySelector('button:not([disabled])')
		.addEventListener('click', function() {
			dialog.close();
		});
}());

$(document).ready(function () {
	$("#Receiver").click(function () {
		var dialog=document.querySelector('#dialog');
		dialog.close();
		$.post("http://"+ipaddress+":8080/Express/UpdataLadTransferMsgMethod",
			{
				adminGUID:getCookie("guid"),
				IDNum:$("#Receiver_IdNum").val()
			},
			function (data) {
				if(data=="1")
					alert("更新成功！");
				else if(data=="2")
				{
					alert("GUID或货物单错误!");
					dialog.showModal();
				}
				else
				{
					alert("存在未知错误！");
					dialog.showModal();
				}

			});
	});
});