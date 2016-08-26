/**
 * Created by xyj64 on 2016/8/24.
 */
$.ajaxSetup({
	async: false
});
// var info=null;同样也是把这两个变量定义在最开头。
// var path=new Array();
function FindPahtByid(idnum,info,path) {
	path.splice(0,path.length);
	$.post("http://" + ipaddress + ":8080/Express/GetLadMsgFromIDNumMethod",
		{
			IDNum:idnum
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
			// alert(info);alert可以输出看一看，不需要就注释掉。
			// for(var i=0;i<path.length;i++)
			// 	alert(path[i]);
		});
}
