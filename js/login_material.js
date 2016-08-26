$(document).ready(function() {
	checkCookie();
	setLoginClick();
	setRegisterClick();
	$('#moveleft').click(function() {
		$('#textbox').animate({
			'marginLeft' : "0" //moves left
		},400);

		$('.toplam').animate({
			'marginLeft' : "100%" //moves right
		},400);
	});

	$('#moveright').click(function() {
		$('#textbox').animate({
			'marginLeft' : "50%" //moves right
		},400);

		$('.toplam').animate({
			'marginLeft' : "0" //moves right
		},400);
	});

});
function setLoginClick() {
	$("#login_btn").click(function () {
		$.post("http://"+ipaddress+":8080/Express/WebLoginMethod",
			{
				username: document.getElementById("login_username").value,
				password: document.getElementById("login_password").value
			},
			function (data) {
				// var data="42363fcdc5be437e8c59602e9a39b4d6#2";
				if(data.toString().indexOf("#")!=-1)
				{
					if (document.getElementById("switch_remember").checked) {
						setCookie("username", document.getElementById("login_username").value, 365);
						setCookie("password", document.getElementById("login_password").value, 365);
					}
					else {
						cleanCookie("username");
						cleanCookie("password");
					}
					var detaildata=data.toString().split("#");
					setCookie("guid", detaildata[0], 365);
					setCookie("power",detaildata[1],365);
					setCookie("address",detaildata[2],365);
					window.location.href = "basispage_chart.html";
				}
				else
				{
					switch (data)
					{
						case "1":window.alert("用户名不存在！");break;
						case "2":window.alert("密码错误！");break;
						case "3":window.alert("用户已登录！");break;
						default:window.alert("出现其他未知错误！");break;
					}
				}
			});
	})
}
function setRegisterClick() {
	$("#register_btn").click(function () {
		$.post("http://"+ipaddress+":8080/Express/RegistMethod",
			{
				Phone:$("#signup_phone").val(),
				Email:$("#signup_mail").val(),
				RegisteCode:$("#signup_register_num").val(),
				psw:$("#signup_password").val(),
				IDName:$("#signup_nickname").val()
			},
			function (data) {
				if(data=="1")
					alert("注册成功！");
				else if(data=="2")
					alert("注册码错误或已使用!");
				else
					alert("存在其他错误！");
			});
	});
}