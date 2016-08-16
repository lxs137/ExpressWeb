$(document).ready(function() {
	checkCookie();
	setClick();
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
function setClick() {
	document.getElementById("login_btn").addEventListener('click', function () {
		$.post("http://172.28.159.124:8080/Express/WebLoginMethod",
			{
				username: document.getElementById("login_username").value,
				password: document.getElementById("login_password").value
			},
			function (data) {
				if(data.length==32)
				{
					window.alert("登陆成功！");
					if (document.getElementById("savepassword").checked) {
						setCookie("username", document.getElementById("username").value, 365);
						setCookie("password", document.getElementById("password").value, 365);
						setCookie("guid", data, 365);
					}
					else {
						cleanCookie("username");
						cleanCookie("password");
						setCookie("guid", data, 365);
					}
					//window.location.href = "Main.html";(返回主界面)
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
	}, false);
}
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