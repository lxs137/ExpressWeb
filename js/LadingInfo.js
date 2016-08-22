/**
 * Created by xyj64 on 2016/8/17.
 */
$.ajaxSetup({
	async:false
});
var ladingInfoManage = new LadingInfoManage();
var deliveryManManage = new Array();
$(document).ready(function () {
	setGetInfoClick();
	setLogoutClick();
	setOnThewayClick();
	initListView();
});
function DeliveryMan(dmguid, dmnickname, dmtelephone, dmemail, dmaddress) {
	var dmGUID = dmguid;
	var dmNickName = dmnickname;
	var dmTelephone = dmtelephone;
	var dmEmail = dmemail;
	var dmAddress = dmaddress;
	var dmLadingInfoManage=new LadingInfoManage();

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

	this.getdmLadingInfoManage=function () {
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

	this.setdmLadingInfoManage=function (dmladinginfomanage,havebeen) {
		dmLadingInfoManage.setData(dmladinginfomanage,havebeen);
	}
}
function setGetInfoClick() {
	// $.post("http://" + ipaddress + ":8080/Express/GetStationLadMsgMethod",
	// 	{
	// 		adminGUID: getCookie("guid")
	// 	},
	// 	function (data) {
	data="9914573044525459#2016-06-10 11:42:35.0#方富玄#江苏省南京市雨花台区 g205#18362916801#0##7875287765618085#2016-06-08 11:42:35.0#吕枝莉#江苏省南京市雨花台区 凤台南路21号#18362917916#0##8288594829498442#2016-06-08 11:42:35.0#孟虹#江苏省南京市建邺区 月安街31号-1#18362915585#0##7231414732623416#2016-06-07 11:42:35.0#曹原#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#18362916535#0##1711392906441163#2016-06-09 11:42:35.0#邓莲吟#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#18362916013#0##9962625039305489#2016-06-10 11:42:35.0#钟安驰#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#18795965259#0##8414886703548457#2016-06-09 11:42:35.0#黄飞#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#18795967861#0##8573517719815118#2016-06-09 11:42:35.0#庞颜帅#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#18795961041#0##0361561149231736#2016-08-12 14:10:57.0#黄毕海#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#18795968013#1##0686852123790223#2016-06-09 11:42:35.0#古素荃#江苏省南京市建邺区 黄山路60号#19033543780#0##5035746218972525#2016-06-07 11:42:35.0#屈嘉昕#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#18795962136#0##1802346291911902#2016-06-09 11:42:35.0#江康#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#18308176566#0##1535575690284452#2016-06-09 11:42:35.0#朱熙香#江苏省南京市白下区 海福巷东118号#15452360083#0##1659204164989963#2016-06-09 11:42:35.0#井焱丹#江苏省南京市秦淮区 大明路118号6-3-902#16754844806#0##9492527743235654#2016-06-10 11:42:35.0#蔡秉飞#江苏省南京市秦淮区 大明路88-8号#18795964047#0##9958392364939908#2016-06-10 11:42:35.0#孔伯聚#江苏省南京市建邺区 梦都大街140号#14001933433#0##1243533070246252#2016-06-09 11:42:35.0#顾楠株#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#11531232873#0##1351729215223859#2016-06-09 11:42:35.0#阮恭琴#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#16643481557#0##7823874785564515#2016-06-08 11:42:35.0#夏良#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#18795961382#0##8422756369425632#2016-06-09 11:42:35.0#汪永良#江苏省南京市栖霞区 仙林街道 南京大学仙林校区#14624129545#0##";
	if (data.toString().indexOf("##") != -1) {
		ladingInfoManage.setData(data,false);
		initladingdata("nestable1", ladingInfoManage,0);
	}
	else {
		if (data == "1")
			alert("GUID错误或无货物信息。");
		else
			alert("存在其它错误。");
	}
	// 	});
	// $.post("http://" + ipaddress + ":8080/Express/GetDeliveryManMethod",
	// 	{
	// 		adminGUID: getCookie("guid")
	// 	},
	// 	function (data) {
	data="c733595fd19d4720a21242dc9b50c898#Rodger#00121333333#Rodger@express.com#null##931587122c314c7c80155d6df26c89f4#Bobby#00121123456#Bobby@express.com#null##fb0a1b04e2544bb685906ed159c45c73#Allen#00121222222#Allen@express.com#null##9ea1f83abd854ca4be9e1634fb377c10#Edward#00121111111#Edward@express.com#null##5318437932d24021b4ed6636708a1a28#Michael#00121444444#Michael@express.com#null##";
	if (data.toString().indexOf("##") != -1) {
		var deliverManInfo = data.toString().split("##");
		for (var i = 0; i < deliverManInfo.length; i++) {
			var detailInfo = deliverManInfo[i].split("#");
			if (detailInfo.length < 5)
				continue;
			deliveryManManage.push(new DeliveryMan(detailInfo[0], detailInfo[1], detailInfo[2], detailInfo[3], detailInfo[4]));
		}
		initpersondata("nestable2", deliveryManManage);
	}
	else {
		if (data == "1")
			alert("GUID错误或无人员信息。");
		else
			alert("存在其它错误。");
	}
	// 	}
	// );
	for(var i=1;i<=deliveryManManage.length;i++)
	{
		// $.post("http://" + ipaddress + ":8080/Express/GetStationLadMsgMethod",
		// 	{
		// 		adminGUID: deliveryManManage[i].getdmGUID()
		// 	},
		// 	function (data) {
		data="9914573044525459#2016-06-10 11:42:35.0#方富玄#江苏省南京市雨花台区 g205#18362916801#0##7875287765618085#2016-06-08 11:42:35.0#吕枝莉#江苏省南京市雨花台区 凤台南路21号#18362917916#0##";
		if (data.toString().indexOf("##") != -1) {
			deliveryManManage[i-1].setdmLadingInfoManage(data,true);
			initladingdata("Person_"+i,deliveryManManage[i-1].getdmLadingInfoManage(),1);
		}
		else {
			if (data == "1")
				alert("GUID错误或无货物信息。");
			else
				alert("存在其它错误。");
		}
		// 	}
		// );
	}
}
function setLogoutClick() {
	document.getElementById("logout").addEventListener('click', function () {
		$.post("http://" + ipaddress + ":8080/Express/WebLogoutMethod",
			{
				adminGUID: getCookie("guid")
			},
			function (data) {
				if (data == "1" || data == "2")
					alert("成功登出!");
				else
					alert("登出失败！存在未知问题！")
			});
	}, false);
}
function setOnThewayClick() {
	$("#on_the_way").click(function () {
		var mark=$("#nestable2").find("li.dd-item").first();
		for(var i=0;i<deliveryManManage.length;i++)
		{
			document.getElementById("test").innerHTML+="start";
			var mark2=mark.find("h3.mdl-card__title-text");
			for(var j=1;j<mark2.length;j++)
			{
				$.post("http://"+ipaddress+":8080/Express/TransferLadMsgMethod",
					{
						adminGUID:getCookie("guid"),
						nextGUID:deliveryManManage[i].getdmGUID(),
						IDNum:mark2.eq(j).text()
					},
					function (data) {
						alert("success");
					});
			}
			mark=mark.next();
		}
	})
}