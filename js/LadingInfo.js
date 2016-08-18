/**
 * Created by xyj64 on 2016/8/17.
 */
var ladinginfomanage=new LadingInfoManage();
$(document).ready(function () {
	setGetInfoClick();
});
function setGetInfoClick() {
	document.getElementById("getInfo").addEventListener('click', function () {
		var starttime=new Date(2016,5,5);
		$.post("http://"+ipaddress+":8080/Express/GetLadMsgMethod",
			{
				adminGUID:getCookie("guid"),
				startTime:starttime.Format("yyyy-MM-dd HH:mm:ss")

			},
			function (data) {
		//var data="8117998663404196#2016-08-17 19:07:14.0#韩关夫#9600 Bellaire Blvd. Suite 101#13321158959#1##4350403813914722#2016-08-16 10:42:35.0#康香#1214 Elgin St,Houston, Texas 77004#13705580574#0##";
				window.alert(data);
				ladinginfomanage.setData(data);
				setCookie("ladinginfomanage",data,365);
			});
		alert(ladinginfomanage.getLadingInfoList()[0].getReceiverName()+"　"+ladinginfomanage.getLadingInfoList()[1].getReceiverName());
		alert(getCookie("ladinginfomanage"));
	},false);
}