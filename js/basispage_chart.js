/**
 * Created by xyj64 on 2016/8/23.
 */
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
		var data1 = [5, 6, 7, 8, 9, 10, 11];
		var data2 = [11, 10, 9, 8, 7, 6, 5];
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
						name: 'GDP占比',
						type: 'pie',
						center: ['50%', '50%'],
						radius: '80%'
					}
				]
			},
			options: [
				{
					title: {text: '2002全国宏观经济指标'},
					series: [
						{
							data: [
								{name: '第一产业', value: data1[0]},
								{name: '第二产业', value: data2[0]}
							]
						}
					]
				},
				{
					title: {text: '2003全国宏观经济指标'},
					series: [
						{
							data: [
								{name: '第一产业', value: data1[1]},
								{name: '第二产业', value: data2[1]}
							]
						}
					]
				},
				{
					title: {text: '2004全国宏观经济指标'},
					series: [
						{
							data: [
								{name: '第一产业', value: data1[2]},
								{name: '第二产业', value: data2[2]}
							]
						}
					]
				},
				{
					title: {text: '2005全国宏观经济指标'},
					series: [
						{
							data: [
								{name: '第一产业', value: data1[3]},
								{name: '第二产业', value: data2[3]}
							]
						}
					]
				},
				{
					title: {text: '2006全国宏观经济指标'},
					series: [
						{
							data: [
								{name: '第一产业', value: data1[4]},
								{name: '第二产业', value: data2[4]}
							]
						}
					]
				},
				{
					title: {text: '2007全国宏观经济指标'},
					series: [
						{
							data: [
								{name: '第一产业', value: data1[5]},
								{name: '第二产业', value: data2[5]}
							]
						}
					]
				},
				{
					title: {text: '2008全国宏观经济指标'},
					series: [
						{
							data: [
								{name: '第一产业', value: data1[6]},
								{name: '第二产业', value: data2[6]}
							]
						}
					]
				}
			]
		};
		if (option && typeof option === "object") {
			myChart.setOption(option, true);
		}
	});
}
function setNumCountClick() {
	$("#numCount").click(function () {
		var myChart = echarts.init(document.getElementById("bar_numCount"));
		var xAxisData = [];
		var data1 = [];
		var data2 = [];
		for (var i = 0; i < 35; i++) {
			xAxisData.push('天数' + i);
			data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
			data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
		}

		option = {
			legend: {
				data: ['送达数目', '未送达数目'],
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
		option.series.push({
			name: '送达数目',
			type: 'bar',
			data: data1,
			animationDelay: function (idx) {
				return idx * 10;
			}
		});
		option.series.push({
			name: '未送达数目',
			type: 'bar',
			data: data2,
			animationDelay: function (idx) {
				return idx * 10 + 100;
			}
		});
		myChart.setOption(option, true);
	})
}
function setWeightCountClick() {
	$("#weightCount").click(function () {
		var myChart = echarts.init(document.getElementById("bar_WeightCount"));
		option = {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['蒸发量', '降水量']
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
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: [
				{
					name: '蒸发量',
					type: 'bar',
					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
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
				},
				{
					name: '降水量',
					type: 'bar',
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
					markPoint: {
						data: [
							{name: '年最高', value: 182.2, xAxis: 7, yAxis: 183},
							{name: '年最低', value: 2.3, xAxis: 11, yAxis: 3}
						]
					},
					markLine: {
						data: [
							{type: 'average', name: '平均值'}
						]
					}
				}
			]
		};
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
	// $.post("http://" + ipaddress + ":8080/Express/GetDeliveryManMethod",
	// 	{
	// 		adminGUID: getCookie("guid")
	// 	},
	// 	function (data) {
	data = "5025377629603609#2016-08-20 08:13:35.0#赖娇雨#1314 Elgin St,Houston, Texas#13793984426#1##4791075269657416#2016-08-20 08:13:35.0#井怡娴#6128 Wilcrest Dr.,Houston, Texas#13470449652#1##6641116752875810#2016-08-20 08:13:35.0#戴彦萧#2405 Smith St,Houston, Texas#13103329639#1##7137144945680316#2016-08-19 08:11:16.0#庞熙瑜#3401 Louisiana St,Houston, Texas#13130193517#0##";
	if (data.toString().indexOf("##") != -1) {
		var info = data.toString().split("##");
		for (var i = 0; i < info.length; i++) {
			var detailInfo = info[i].split("#");
			if (detailInfo.length < 4)
				continue;
			var weekinfo = new WeekInfo();
			weekinfo.setGuid(detailInfo[0]);
			weekinfo.setNickName(detailInfo[2]);
			stationinfo.push(weekinfo);
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

	// });
	for (var i = 0; i < stationinfo.length; i++) {
		var originalDate = getNearByDate(new Date(), -7);
		var afterDate = getNearByDate(originalDate, 1);
		for (var j = 0; j < 7; j++) {
			// $.post("http://" + ipaddress + ":8080/Express/GetHisMsgMethod",
			// 	{
			// 		adminGUID: stationinfo[i].getGuid(),
			// 		startTime: originalDate.Format("yyyy-MM-dd") + " 0:0:0",
			// 		endTime: afterDate.Format("yyyy-MM-dd") + " 0:0:0"
			// 	},
			// 	function (data) {
			var data = "5#3#2#16.2#22#";
			if (data.toString().indexOf("#") != -1) {
				var detaildata = data.toString().split("#");
				if (detaildata.length > 1) {
					stationinfo[i].getPersonList().push(new DailyInfoCount(detaildata[0], detaildata[1], detaildata[2], detaildata[3], detaildata[4], originalDate.Format("yyyy-MM-dd")));
				}
			}
			else
				alert("存在其他错误。");
			// }
			// );
			originalDate = afterDate;
			afterDate = getNearByDate(originalDate, 1);
		}
	}
}
function getNearByDate(original, i) {
	var t = original.getTime() + 1000 * 60 * 60 * 24 * i;
	return new Date(t);
}