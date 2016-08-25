/**
 * Created by xyj64 on 2016/8/23.
 */
$.ajaxSetup({
	async: false
});
var stationinfo = new Array();
$(document).ready(function () {
	getInfo();
	setIsDeliveryCount();
	setNumCountClick();
	setWeightCountClick();
	$("#isDeliveryCount").click();
});
function setIsDeliveryCount() {
	$("#isDeliveryCount").click(function () {
		var myChart = echarts.init(document.getElementById("pie_isDeliveryCount"));
		// 指定图表的配置项和数据
		var option = null;
		option = {
			baseOption: {
				timeline: {
					// y: 0,
					axisType: 'category',
					// realtime: false,
					// loop: false,
					autoPlay: true,
					// currentIndex: 2,
					playInterval: 1000,
					// controlStyle: {
					//     position: 'left'
					// },
					data: [
						stationinfo[0].getPersonList()[0].getDateStr(), stationinfo[0].getPersonList()[1].getDateStr(), stationinfo[0].getPersonList()[2].getDateStr(),
						stationinfo[0].getPersonList()[3].getDateStr(), stationinfo[0].getPersonList()[4].getDateStr(), stationinfo[0].getPersonList()[5].getDateStr(), stationinfo[0].getPersonList()[6].getDateStr()
					],
					label: {
						formatter: function (s) {
							return (new Date(s)).Format("MM-dd");
						}
					}
				},
				tooltip: {},
				calculable: true,
				grid: {
					top: 80,
					bottom: 100
				},
				series: [
					{
						name: '快递员送货情况统计',
						type: 'pie',
						center: ['50%', '50%'],
						radius: '80%'
					}
				]
			},
			options: [
				{
					series: [
						{
							data: [],
							itemStyle: {
								normal: {
									shadowBlur: 200,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
						}
					]
				},
				{
					series: [
						{
							data: []
						}
					]
				},
				{
					series: [
						{
							data: []
						}
					]
				},
				{
					series: [
						{
							data: []
						}
					]
				},
				{
					series: [
						{
							data: []
						}
					]
				},
				{
					series: [
						{
							data: []
						}
					]
				},
				{
					series: [
						{
							data: []
						}
					]
				}
			]
		};
		for (var i = 0; i < 7; i++)
			for (var j = 0; j < stationinfo.length; j++)
				option.options[i].series[0].data.push({
					name: stationinfo[j].getNickName(),
					value: stationinfo[j].getPersonList()[i].getUnDeliveriedNum()
				});
		if (option && typeof option === "object") {
			myChart.setOption(option, true);
		}
	});
}
function setNumCountClick() {
	$("#numCount").click(function () {
		var myChart = echarts.init(document.getElementById("bar_numCount"));
		var xAxisData = [];
		var data = new Array();
		for (var i = 0; i < stationinfo.length; i++) {
			var persondata = new Array();
			data.push(persondata);
		}
		for (var i = 0; i < 7; i++) {
			xAxisData.push(stationinfo[0].getPersonList()[i].getDateStr());
			for (var j = 0; j < stationinfo.length; j++) {
				data[j].push(stationinfo[j].getPersonList()[i].getUnDeliveriedNum());
			}
		}

		option = {
			legend: {
				data: [],
				align: 'left'
			},
			toolbox: {
				// y: 'bottom',
				feature: {
					magicType: {
						type: ['stack', 'tiled']
					},
					saveAsImage: {
						pixelRatio: 2
					}
				}
			},
			tooltip: {},
			xAxis: {
				data: xAxisData,
				silent: false,
				splitLine: {
					show: false
				}
			},
			yAxis: {},
			series: [],
			animationEasing: 'elasticOut',
			animationDelayUpdate: function (idx) {
				return idx * 5;
			}
		};
		for (var i = 0; i < stationinfo.length; i++) {
			option.legend.data.push(stationinfo[i].getNickName());
			option.series.push(
				{
					name: stationinfo[i].getNickName(),
					type: 'bar',
					data: data[i],
					animationDelay: function (idx) {
						return idx * 10 + i * 100;
					}
				}
			)
		}
		myChart.setOption(option, true);
	})
}
function setWeightCountClick() {
	$("#weightCount").click(function () {
		var myChart = echarts.init(document.getElementById("bar_WeightCount"));
		var xAxisData = [];
		var data = new Array();
		for (var i = 0; i < stationinfo.length; i++) {
			var persondata = new Array();
			data.push(persondata);
		}
		for (var i = 0; i < 7; i++) {
			xAxisData.push(stationinfo[0].getPersonList()[i].getDateStr());
			for (var j = 0; j < stationinfo.length; j++) {
				data[j].push(stationinfo[j].getPersonList()[i].getUnDeliveriedWeight());
			}
		}
		option = {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: []
			},
			toolbox: {
				show: true,
				feature: {
					magicType: {show: true, type: ['line', 'bar']},
					saveAsImage: {show: true}
				}
			},
			calculable: true,
			xAxis: [
				{
					type: 'category',
					data: xAxisData
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: []
		};
		for (var i = 0; i < stationinfo.length; i++) {
			option.legend.data.push(stationinfo[i].getNickName());
			option.series.push(
				{
					name: stationinfo[i].getNickName(),
					type: 'bar',
					data: data[i],
					markPoint: {
						data: [
							{type: 'max', name: '最大值'},
							{type: 'min', name: '最小值'}
						]
					},
					markLine: {
						data: [
							{type: 'average', name: '平均值'}
						]
					}
				}
			)
		}
		myChart.setOption(option, true);
	})
}
function WeekInfo() {
	var personList = new Array();
	var Guid = null;
	var nickName = null;

	this.getGuid = function () {
		return Guid;
	};

	this.setGuid = function (guid) {
		Guid = guid;
	};

	this.getPersonList = function () {
		return personList;
	};

	this.getNickName = function () {
		return nickName;
	};

	this.setNickName = function (nickname) {
		nickName = nickname;
	}
}
function DailyInfoCount(totalnum, deliveriednum, undeliveriednum, deliveriedweight, undeliveriedweight, datestr) {
	var totalNum = totalnum;
	var deliveriedNum = deliveriednum;
	var unDeliveriedNum = undeliveriednum;
	var deliveriedWeight = deliveriedweight;
	var unDeliveriedWeight = undeliveriedweight;
	var dateStr = datestr;

	this.getDateStr = function () {
		return dateStr;
	};

	this.getTotalNum = function () {
		return totalNum;
	};

	this.getDeliveriedNum = function () {
		return deliveriedNum;
	};

	this.getUnDeliveriedNum = function () {
		return unDeliveriedNum;
	};

	this.getDeliveriedWeight = function () {
		return deliveriedWeight;
	};

	this.getUnDeliveriedWeight = function () {
		return unDeliveriedWeight;
	};

	this.setTotalNum = function (totalnum) {
		totalNum = totalnum;
	};

	this.setDeliveriedNum = function (deliveriednum) {
		deliveriedNum = deliveriednum;
	};

	this.setUnDeliveriedNum = function (undeliveriednum) {
		unDeliveriedNum = undeliveriednum;
	};

	this.setDeliveriedWeight = function (deliveriedweight) {
		deliveriedWeight = deliveriedweight;
	};

	this.setUnDeliveriedWeight = function (undeliveriedweight) {
		unDeliveriedWeight = undeliveriedweight;
	};

	this.setDateStr = function (datestr) {
		dateStr = datestr;
	}
}
function getInfo() {
	$.post("http://" + ipaddress + ":8080/Express/GetDeliveryManMethod",
		{
			adminGUID: getCookie("guid")
		},
		function (data) {
			// data = "b5f12f659ec2475daebbbeed2ab19d87#Dallas#00121000003#Dallas@express.com#701 Commerce St, Dallas, Texas##2eb622afb3314c829039624621214146#SanAntonio#00121000004#SanAntonio@express.com#321 S Main Ave, San Antonio, Texas##c4df89ec3285495c92caa6a8e1e72a6e#Austin#00121000002#Austin@express.com#925 W 5th St, Austin, Texas##42363fcdc5be437e8c59602e9a39b4d6#Houston#00121000001#Huston@express.com#911 Andrews St, Houston, Texas##";
			if (data.toString().indexOf("##") != -1) {
				var info = data.toString().split("##");
				for (var i = 0; i < info.length; i++) {
					var detailInfo = info[i].split("#");
					if (detailInfo.length < 4)
						continue;
					var weekinfo = new WeekInfo();
					weekinfo.setGuid(detailInfo[0]);
					weekinfo.setNickName(detailInfo[1]);
					stationinfo.push(weekinfo);
					alert(stationinfo[i].getNickName() + "　" + stationinfo[i].getGuid());
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
	for (var i = 0; i < stationinfo.length; i++) {
		var originalDate = getNearByDate(new Date(), -7);
		var afterDate = getNearByDate(originalDate, 1);
		for (var j = 0; j < 7; j++) {
			$.post("http://" + ipaddress + ":8080/Express/GetHisMsgMethod",
				{
					adminGUID: stationinfo[i].getGuid(),
					startTime: originalDate.Format("yyyy-MM-dd") + " 0:0:0",
					endTime: afterDate.Format("yyyy-MM-dd") + " 0:0:0"
				},
				function (data) {
					// var data = "5#3#2#null#null#";
					if (data.toString().indexOf("#") != -1) {
						var detaildata = data.toString().split("#");
						if (detaildata.length > 1) {
							if (detaildata[0] == "null")
								detaildata[0] = "0";
							if (detaildata[1] == "null")
								detaildata[1] = "0";
							if (detaildata[2] == "null")
								detaildata[2] = "0";
							if (detaildata[3] == "null")
								detaildata[3] = "0";
							if (detaildata[4] == "null")
								detaildata[4] = "0";
							stationinfo[i].getPersonList().push(new DailyInfoCount(detaildata[0], detaildata[1], detaildata[2], detaildata[3], detaildata[4], originalDate.Format("yyyy-MM-dd")));
						}
					}
					else
						alert("存在其他错误。");
				}
			);
			originalDate = afterDate;
			afterDate = getNearByDate(originalDate, 1);
		}
	}
}
function getNearByDate(original, i) {
	var t = original.getTime() + 1000 * 60 * 60 * 24 * i;
	return new Date(t);
}