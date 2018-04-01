function processAuthority(codeList) {
	//权限
	$("[code]").each(function (index, ele) {
		ele = $(ele);
		var code = $(ele).attr("code");

		var isFind = false;
		for (var i = 0; i < codeList.length; i++) {
			if (code == codeList[i]) {
				isFind = true;
				break;
			}
		}

		if (isFind) {
			ele.show();
		} else {
			ele.remove();
		}
	});
}

$(function () {
	var path = window.location.protocol + '//' + window.location.host;
	$.ajax({
		url: path + "/nets-budget/user/get_login_user",
		dataType: 'json',
		type: 'get',
		cache: false,
		success: function success(rs) {

			userInfo = rs.data;
			userInfo.id = rs.userId;
			userInfo.name = rs.userName;

			var codeList = [];
			for (var i = 0; i < userInfo.userMenuList.length; i++) {
				var code = userInfo.userMenuList[i].code;
				codeList.push(code);
			}

			for (var i = 0; i < userInfo.userFunctionList.length; i++) {
				var code = userInfo.userFunctionList[i].code;
				codeList.push(code);;
			}
			processAuthority(codeList);
		}
	});
});
