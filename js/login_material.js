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
		$.post("http://"+ipaddress+":8080/Express/WebLoginMethod",
			{
				username: document.getElementById("login_username").value,
				password: document.getElementById("login_password").value
			},
			function (data) {
				if(data.length==32)
				{
					if (document.getElementById("switch_remember").checked) {
						setCookie("username", document.getElementById("login_username").value, 365);
						setCookie("password", document.getElementById("login_password").value, 365);
						setCookie("guid", data, 365);
					}
					else {
						cleanCookie("username");
						cleanCookie("password");
						setCookie("guid", data, 365)
					}
					window.location.href = "../station_listItem.html";
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