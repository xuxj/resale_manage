var Ajax = function Ajax() {};

Ajax.get = function (url, successCallback, errorCallback) {
	$.ajax({ url: url, type: "get", success: function success(result) {
			successCallback(result);
		}, error: function error(xhr, status, _error) {
			if (typeof errorCallback == "function") {
				errorCallback(xhr, status, _error);
			} else {
				alert("操作失败，请稍后重试");
			}
		} });
};

/**
 * 同步ajax
 */
Ajax.syncGet = function (url, successCallback, errorCallback) {
	$.ajax({ url: url, type: "get", async: false, success: function success(result) {
			successCallback(result);
		}, error: function error(xhr, status, _error2) {
			if (typeof errorCallback == "function") {
				errorCallback(xhr, status, _error2);
			} else {
				alert("操作失败，请稍后重试");
			}
		} });
};

Ajax.post = function (url, postData, successCallback, errorCallback) {
	$.ajax({ url: url, type: "post", data: postData, success: function success(result) {
			successCallback(result);
		}, error: function error(xhr, status, _error3) {
			if (typeof errorCallback == "function") {
				errorCallback(xhr, status, _error3);
			} else {
				alert("操作失败，请稍后重试");
			}
		} });
};

Ajax.postSync = function (url, postData, successCallback, errorCallback) {
	$.ajax({ url: url, type: "post", "async": false, data: postData, success: function success(result) {
			successCallback(result);
		}, error: function error(xhr, status, _error4) {
			if (typeof errorCallback == "function") {
				errorCallback(xhr, status, _error4);
			} else {
				alert("操作失败，请稍后重试");
			}
		} });
};
//树
/*var Tree = {
	orgTree: function(){
		var zNodes =[
				{id:1, pId:0, name:"北京"},
				{id:2, pId:0, name:"天津"},
				{id:3, pId:0, name:"上海"}
			];
		var data =Ajax.post(url,postData,successCallback,errorCallback);
		function beforeClick(treeId, treeNode) {}

		function onClick(e, treeId, treeNode) {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
				nodes = zTree.getSelectedNodes(),
				v =  nodes[0].name;
				var cityObj = $("#citySel");
				cityObj.attr("value", v);
				hideMenu();
		}

		function showMenu() {
			var cityObj = $("#citySel");
			var cityOffset = $("#citySel").offset();
			$("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top + cityObj.outerHeight() + "px"}).slideDown("fast");
		}
		function hideMenu() {
			$("#menuContent").fadeOut("fast");
		}
	$.fn.zTree.init($("#treeDemo"), {
		view:{dblClickExpand:false},
		data:{
			simpleData: {enable:true}
			},
		callback:{
			beforeClick: beforeClick,
			onClick: onClick
		}
	}, zNodes);
	}
};*/
