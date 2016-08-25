/**
 * Created by xyj64 on 2016/8/24.
 */
var info=null;
var path=new Array();
$(document).ready(function () {
	$("#getpath").click(function () {
		$.post("http://" + ipaddress + ":8080/Express/GetLadMsgFromIDNumMethod",
			{
				IDNum:$("#input_idnum").val()
			},
			function (data) {
				if (data.toString().indexOf("##")!=-1)
				{
					var detaildata=data.toString().split("##");
					info=detaildata[0];
					for(var i=1;i<detaildata.length;i++)
					{
						path.push((detaildata[i]));
					}
				}
				else if(data=="1")
					alert("IDNum错误！");
				else
					alert("存在其他错误！");
			});
		alert(info);
		for(var i=0;i<path.length;i++)
			alert(path[i]);
	});
});