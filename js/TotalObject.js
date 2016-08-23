/**
 * Created by xyj64 on 2016/8/17.
 */
var ipaddress="172.26.52.66";
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}
function checkCookie() {
	var user = getCookie("username");
	var pwd = getCookie("password");
	if (user != "" && pwd != "") {
		document.getElementById("login_username").value = user;
		document.getElementById("login_password").value = pwd;
	}
}

function cleanCookie(cname) {
	document.cookie = cname + "=" + ";expires=Thu, 01-Jan-70 00:00:01 GMT";
}

Date.prototype.Format = function (fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"H+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};
function LadingInfo(ladingidnum,updatatime,receivername,receiveraddress,receiverphone,isdelivered,havebeen) {
	var ladingIdNum=ladingidnum;
	var upDataTime=updatatime;
	var receiverName=receivername;
	var receiverAddress=receiveraddress;
	var receiverPhone=receiverphone;
	var isDelivered=isdelivered;

	this.getLadingIdNum=function () {
		return ladingIdNum;
	};

	this.getUpDataTime=function () {
		return upDataTime;//.Format("yyyy-MM-dd HH:mm:ss");
	};

	this.getReceiverName=function () {
		return receiverName;
	};

	this.getReceiverAddress=function () {
		return receiverAddress;
	};

	this.getReceiverPhone=function () {
		return receiverPhone;
	};

	this.getIsDelivered=function () {
		return isDelivered;
	};

	this.setLadingIdNum=function (ladingidnum) {
		ladingIdNum=ladingidnum;
	};

	this.setUpDataTimeDate=function (updatatime) {
		upDataTime=updatatime;
	};

	this.setUpDataTimeStr=function (updatatimestr) {
		var data=updatatimestr.split(" ");
		var day=data[0].split("-");
		var time=data[1].split(":");
		upDataTime=new Date(day[0],day[1]-1,day[2],time[0],time[1],time[2]);
		alert(upDataTime.Format('yyyy-MM-dd HH:mm:ss'));
	};

	this.setReceiverName=function (receivername) {
		receiverName=receivername;
	};

	this.setReceiverAddress=function (receiveraddress) {
		receiverAddress=receiveraddress;
	};

	this.setReceiverPhone=function (receiverphone) {
		receiverPhone=receiverphone;
	};

	this.setIsDelivered=function (isdelivered) {
		isDelivered=isdelivered;
	};
}
function LadingInfoManage() {
	var LadingInfoList=new Array();

	this.setData=function(postBackLadingInfo)
	{
		var data=postBackLadingInfo.split("##");
		for(var i=0;i<data.length;i++)
		{
			var detailData=data[i].split("#");
			if(detailData.length<4)
				continue;
			LadingInfoList.push(new LadingInfo(detailData[0],detailData[1],detailData[2],detailData[3],detailData[4],detailData[5]));
		}
	};

	this.addData=function (ladinginfo) {
		LadingInfoList.push(ladinginfo);
	};

	this.getLadingInfoList=function () {
		return LadingInfoList;
	};

	this.orderByIdNum=function () {
		LadingInfoList.sort(function (ladingInfo1,ladingInfo2) {
			return ladingInfo1.getLadingIdNum().localeCompare(ladingInfo2.getLadingIdNum());
		})
	};

	this.orderByIsDelivered=function () {
		LadingInfoList.sort(function (ladingInfo1,ladingInfo2) {
			if(ladingInfo1.getIsDelivered()&&!ladingInfo2.getIsDelivered())
				return 1;
			else
				return -1;
		})
	};

	this.orderByUpDataTime=function () {
		LadingInfoList.sort(function (ladingInfo1,ladingInfo2) {
			return ladingInfo1.getUpDataTime().localeCompare(ladingInfo2.getUpDataTime());
		})
	}
}