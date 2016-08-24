/**
 * Created by xyj64 on 2016/8/24.
 */
$(document).ready(function () {
	$("#Receiver").click(function () {
		$.post("http://"+ipaddress+":8080/Express/UpdataLadTransferMsgMethod",
			{
				adminGUID:getCookie("guid"),
				IDNum:$("#Receiver_IdNum").val()
			},
			function (data) {
				if(data=="1")
					alert("更新成功！");
				else if(data=="2")
					alert("GUID或货物单错误!");
				else
					alert("存在未知错误！");
			});
	});
});