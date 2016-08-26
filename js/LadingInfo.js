/**
 * Created by xyj64 on 2016/8/17.
 */
$.ajaxSetup({
	async: false
});
var ladingInfoManage = new LadingInfoManage();
var deliveryManManage = new Array();
$(document).ready(function () {
	setGetInfoClick();
	setOnThewayClick();
	initListView();
});
function DeliveryMan(dmguid, dmnickname, dmtelephone, dmemail, dmaddress) {
	var dmGUID = dmguid;
	var dmNickName = dmnickname;
	var dmTelephone = dmtelephone;
	var dmEmail = dmemail;
	var dmAddress = dmaddress;
	var dmLadingInfoManage = new LadingInfoManage();

	this.getdmGUID = function () {
		return dmGUID;
	};

	this.getdmNickName = function () {
		return dmNickName;
	};

	this.getdmTelephone = function () {
		return dmTelephone;
	};

	this.getdmEmail = function () {
		return dmEmail;
	};

	this.getdmAddress = function () {
		return dmAddress;
	};

	this.getdmLadingInfoManage = function () {
		return dmLadingInfoManage;
	};

	this.setdmGUID = function (dmguid) {
		dmGUID = dmguid;
	};

	this.setdmNickName = function (dmnickname) {
		dmNickName = dmnickname;
	};

	this.setdmTelephone = function (dmtelephone) {
		dmTelephone = dmtelephone;
	};

	this.setdmEmail = function (dmemail) {
		dmEmail = dmemail;
	};

	this.setdmAddress = function (dmaddress) {
		dmAddress = dmaddress;
	};

	this.setdmLadingInfoManage = function (dmladinginfomanage) {
		dmLadingInfoManage.setData(dmladinginfomanage);
	}
}
function setGetInfoClick() {
	$.post("http://" + ipaddress + ":8080/Express/GetStationLadMsgMethod",
		{
			adminGUID: getCookie("guid")
		},
		function (data) {
			// data = "5025377629603609#2016-08-20 08:13:35.0#赖娇雨#1314 Elgin St,Houston, Texas#13793984426#1##4791075269657416#2016-08-20 08:13:35.0#井怡娴#6128 Wilcrest Dr.,Houston, Texas#13470449652#1##6641116752875810#2016-08-20 08:13:35.0#戴彦萧#2405 Smith St,Houston, Texas#13103329639#1##7137144945680316#2016-08-19 08:11:16.0#庞熙瑜#3401 Louisiana St,Houston, Texas#13130193517#0##";
			if (data.toString().indexOf("##") != -1) {
				ladingInfoManage.setData(data);
				initladingdata("nestable1", ladingInfoManage, 0);
			}
			else {
				if (data == "1")
					alert("GUID错误。");
				else if (data == "2")
					alert("无货物信息。");
				else
					alert("存在其它错误。");
			}
		});
	$.post("http://" + ipaddress + ":8080/Express/GetDeliveryManMethod",
		{
			adminGUID: getCookie("guid")
		},
		function (data) {
			// data = "c733595fd19d4720a21242dc9b50c898#Rodger#00121333333#Rodger@express.com#null##931587122c314c7c80155d6df26c89f4#Bobby#00121123456#Bobby@express.com#null##fb0a1b04e2544bb685906ed159c45c73#Allen#00121222222#Allen@express.com#null##9ea1f83abd854ca4be9e1634fb377c10#Edward#00121111111#Edward@express.com#null##5318437932d24021b4ed6636708a1a28#Michael#00121444444#Michael@express.com#null##";
			if (data.toString().indexOf("##") != -1) {
				var deliverManInfo = data.toString().split("##");
				for (var i = 0; i < deliverManInfo.length; i++) {
					var detailInfo = deliverManInfo[i].split("#");
					if (detailInfo.length < 5)
						continue;
					deliveryManManage.push(new DeliveryMan(detailInfo[0], detailInfo[1], detailInfo[2], detailInfo[3], detailInfo[4]));
				}
				if (getCookie("power") == "2")
					initpersondata("nestable2", deliveryManManage);
				else
					initstationdata("nestable2", deliveryManManage);
			}
			else {
				if (data == "1")
					alert("GUID错误。");
				else if (data == "2")
					alert("无货物信息。");
				else if (data == "3")
					alert("无此权限。");
				else
					alert("存在其他错误。");
			}
		}
	);
	for (var i = 1; i <= deliveryManManage.length; i++) {
		$.post("http://" + ipaddress + ":8080/Express/GetStationLadMsgMethod",
			{
				adminGUID: deliveryManManage[i - 1].getdmGUID()
			},
			function (data) {
				// data="5025377629603609#2016-08-20 08:13:35.0#赖娇雨#1314 Elgin St,Houston, Texas#13793984426#1##4791075269657416#2016-08-20 08:13:35.0#井怡娴#6128 Wilcrest Dr.,Houston, Texas#13470449652#1##6641116752875810#2016-08-20 08:13:35.0#戴彦萧#2405 Smith St,Houston, Texas#13103329639#1##7137144945680316#2016-08-19 08:11:16.0#庞熙瑜#3401 Louisiana St,Houston, Texas#13130193517#0##";
				if (data.toString().indexOf("##") != -1) {
					deliveryManManage[i - 1].setdmLadingInfoManage(data);
					initladingdata("Person_" + i, deliveryManManage[i - 1].getdmLadingInfoManage(), 1);
				}
				else {
					if (data == "1")
						alert("GUID错误。");
					else if (data == "2")
						alert("无货物信息。");
					else
						alert("存在其它错误。");
				}
			}
		);
	}
}
function setOnThewayClick() {
	$("#on_the_way").click(function () {
		var mark = $("#nestable2").find("li.dd-item").first();
		for (var i = 0; i < deliveryManManage.length; i++) {
			document.getElementById("test").innerHTML += "start ";
			var mark2 = mark.find("li.dd-item");
			for (var j = 0; j < mark2.length; j++) {
				var mark3 = mark2.eq(j).children();
				if (mark3.attr("class").toString().indexOf("undraged") != -1)
					continue;
				$.post("http://" + ipaddress + ":8080/Express/TransferLadMsgMethod",
					{
						adminGUID: getCookie("guid"),
						nextGUID: deliveryManManage[i].getdmGUID(),
						IDNum: mark3.find("h3.mdl-card__title-text").text()
					},
					function (data) {
						alert("success");
					});
			}
			mark = mark.next();
		}
	})
}