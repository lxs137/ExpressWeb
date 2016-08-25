/**
 * Created by xyj64 on 2016/8/25.
 */
$(document).ready(function () {
	setcreateonclick();
	setClearButton();
	setSpecificationsButton();
});
function setcreateonclick() {
	$("#create_new_lading").click(function () {
		$.post("http://" + ipaddress + ":8080/Express/AddNewLadMsgMethod",
			{
				adminGUID: getCookie("guid"),
				LadingName: $("#ladingname").val(),
				SenderName: $("#sendername").val(),
				SenderPhone: $("#senderphone").val(),
				SenderAddress: $("#senderaddress").val(),
				ReceiverName: $("#receivername").val(),
				ReceiverPhone: $("#receiverphone").val(),
				ReceiverAddress: $("#receiveraddress").val(),
				LadingWeight: $("#ladingweight").val(),
				LadingSpecifications: document.getElementById("specificationsName").innerHTML//下拉列表
			},
			function (data) {
				if (data.toString().length == 16) {
					alert(data);
				}
				else if (data == "1")
					alert("无此权限！");
				else if (data == "2")
					alert("导入失败！");
				else
					alert("存在其他错误！");
			});
	});
}
function setClearButton() {
	$(".sender_clean").click(function () {
		document.getElementById("sendername").value="";
		document.getElementById("senderphone").value="";
		document.getElementById("senderaddress").value="";
	});
	$(".receiver_clean").click(function () {
		document.getElementById("receivername").value="";
		document.getElementById("receiverphone").value="";
		document.getElementById("receiveraddress").value="";
	});
}
function setSpecificationsButton() {
	$(".specifications_menu_item").click(
		function(){
			var specificationsName;
			switch (this.value) {
				case 0:
					specificationsName = "小";
					break;
				case 1:
					specificationsName = "中";
					break;
				case 2:
					specificationsName = "大";
					break;
				case 3:
					specificationsName = "超大";
					break;
				case 4:
					specificationsName = "特大";
					break;
			}
			document.getElementById("specificationsName").innerHTML=specificationsName;
		});
}