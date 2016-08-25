/**
 * Created by xyj64 on 2016/8/24.
 */
$.ajaxSetup({
	async: false
});
var ladinginfoList = new Array();
var record1 = new Array();
var record2 = new Array();
$(document).ready(function () {
	initdata();
});
function initdata() {
	$.post("http://" + ipaddress + ":8080/Express/GetStationLadMsgMethod",
		{
			adminGUID: getCookie("guid")
		},
		function (data) {
			// var data = "1744297122550730#2016-08-19 08:11:16.0#孙信#206 Loper Avenue, Houston, Texas#13386480950#1##1256513997355059#2016-08-19 08:11:16.0#郭同骏#2912 Wheeler St, Houston, Texas#13733396594#1##2880415148951369#2016-08-19 08:11:16.0#高雯灵#3231 N Macgregor Way, Houston, Texas 77004#13664420507#1##8311079123488135#2016-08-19 08:11:16.0#鲁蝶姿#5725 Belcrest Street, Houston, Texas#13333406471#1##";
			if (data.toString().indexOf("##") != -1) {
				var info = data.toString().split("##");
				for (var i = 0; i < info.length; i++) {
					var detailinfo = info[i].split("#");
					if (detailinfo.length < 4)
						continue;
					ladinginfoList.push(new LadingInfo(detailinfo[0], detailinfo[1], detailinfo[2], detailinfo[3], detailinfo[4], detailinfo[5], "address"/*getCookie("address")*/));
				}
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
					record1.push({guid: detailInfo[0], address: detailInfo[4]});
				}
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
	for (var i = 1; i <= record1.length; i++) {
		$.post("http://" + ipaddress + ":8080/Express/GetStationLadMsgMethod",
			{
				adminGUID: record1[i - 1].guid
			},
			function (data) {
				// 			data="5025377629603609#2016-08-20 08:13:35.0#赖娇雨#1314 Elgin St,Houston, Texas#13793984426#1##4791075269657416#2016-08-20 08:13:35.0#井怡娴#6128 Wilcrest Dr.,Houston, Texas#13470449652#1##6641116752875810#2016-08-20 08:13:35.0#戴彦萧#2405 Smith St,Houston, Texas#13103329639#1##7137144945680316#2016-08-19 08:11:16.0#庞熙瑜#3401 Louisiana St,Houston, Texas#13130193517#0##";
				if (data.toString().indexOf("##") != -1) {
					var info = data.toString().split("##");
					for (var j = 0; j< info.length; j++) {
						var detailinfo = info[j].split("#");
						if (detailinfo.length < 4)
							continue;
						if (getCookie("power") == "2")
							ladinginfoList.push(new LadingInfo(detailinfo[0], detailinfo[1], detailinfo[2], detailinfo[3], detailinfo[4], detailinfo[5], detailinfo[3]));
						else
							ladinginfoList.push(new LadingInfo(detailinfo[0], detailinfo[1], detailinfo[2], detailinfo[3], detailinfo[4], detailinfo[5], record1[i - 1].address));
					}
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
	if (getCookie("power") == "3")
		for (var i = 1; i <= 4/*record1.length*/; i++) {
			{
				record2.splice(0,record2.length);
				$.post("http://" + ipaddress + ":8080/Express/GetDeliveryManMethod",
					{
						adminGUID: record1[i - 1].guid
					},
					function (data) {
				// data = "c733595fd19d4720a21242dc9b50c898#Rodger#00121333333#Rodger@express.com#1808 Kipling St, Houston, Texas##931587122c314c7c80155d6df26c89f4#Bobby#00121123456#Bobby@express.com#1418 Sul Ross St, Houston, Texas##fb0a1b04e2544bb685906ed159c45c73#Allen#00121222222#Allen@express.com#905 Hawthorne St, Houston, Texas##9ea1f83abd854ca4be9e1634fb377c10#Edward#00121111111#Edward@express.com#1418 Sul Ross St, Houston, Texas##5318437932d24021b4ed6636708a1a28#Michael#00121444444#Michael@express.com#1515 Hyde Park Blvd, Houston, Texas##";
				if (data.toString().indexOf("##") != -1) {
					alert("success!");
							var deliverManInfo = data.toString().split("##");
							for (var j = 0; j < deliverManInfo.length; j++) {
								var detailInfo = deliverManInfo[j].split("#");
								if (detailInfo.length < 5)
									continue;
								alert("success!");
								record2.push(detailInfo[0]);
								alert("success!");
							}
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
				for (var k = 1; k <= record2.length; k++) {
					$.post("http://" + ipaddress + ":8080/Express/GetStationLadMsgMethod",
						{
							adminGUID: record2[k - 1]
						},
						function (data) {
							// 						data="5025377629603609#2016-08-20 08:13:35.0#赖娇雨#1314 Elgin St,Houston, Texas#13793984426#1##4791075269657416#2016-08-20 08:13:35.0#井怡娴#6128 Wilcrest Dr.,Houston, Texas#13470449652#1##6641116752875810#2016-08-20 08:13:35.0#戴彦萧#2405 Smith St,Houston, Texas#13103329639#1##7137144945680316#2016-08-19 08:11:16.0#庞熙瑜#3401 Louisiana St,Houston, Texas#13130193517#0##";
							if (data.toString().indexOf("##") != -1) {
								var info = data.toString().split("##");
								for (var j = 0; j < info.length; j++) {
									var detailinfo = info[j].split("#");
									if (detailinfo.length < 4)
										continue;
									ladinginfoList.push(new LadingInfo(detailinfo[0], detailinfo[1], detailinfo[2], detailinfo[3], detailinfo[4], detailinfo[5], detailinfo[3]));
								}
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
		}
	for (var i = 0; i < ladinginfoList.length; i++) {
		document.getElementById("test").innerHTML += ladinginfoList[i].getLadingIdNum() + " " +ladinginfoList[i].getPos+ ladinginfoList[i].getNowPosition() + " " + i + "<br\>";
	}
}