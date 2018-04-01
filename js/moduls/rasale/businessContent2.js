
var businessContent2 = angular.module('businessContent2', []);
//定义合约列表控制器
businessContent2.controller('businessContent2', function ($rootScope, $scope, $http, $timeout) {


	var path = window.location.protocol + '//' + window.location.host;
	var defaultPageSize = 10;
	$scope.typeList = [];
	$scope.pageSizeList = [5,10,20];
	$scope.contentTypes = [];
	$scope.pid = 0;
	
	$scope.isNotNull = function (param) {
		if (param == undefined || param === "") {
			return false;
		}
		return true;
	};
	
	$scope.getContentTypeList = function(){
		$http({
			method: "post",
			url: path + "/admin/business_content/pageBusinessContent?pid=-1&pageNum=1&pageSize=1000",
			data: {}
		}).success(function (rs) {
			if (rs && rs.code == 0) {
				console.log(rs);
				
				$scope.contentTypes = rs.data.list;
				$scope.contentType = rs.data.list[0].id;
				$scope.pid = $scope.contentType;
				$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
				
			} else {
				console.log("获取业务类型异常!");
				console.log(rs);
			}
		}).error(function (rs) {
			console.log("获取业务类型异常!");
			console.log(rs);
		});
	};
	
	$scope.changeType = function(){
		console.log("change");
		$scope.pid = $scope.contentType;
		console.log("pid:----------"+$scope.pid);
		$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
	}

	
	$scope.pageData = function (pageObj) {
			
			console.log(pageObj.pageNum+"-------"+pageObj.pageSize);
			$http({
			method: "post",
			url: path + "/admin/business_content/pageBusinessContent?pid="+$scope.pid+"&pageNum="+pageObj.pageNum+"&pageSize="+pageObj.pageSize,
			data: {}
		}).success(function (rs) {
			if (rs && rs.code == 0) {
				console.log(rs);
				$scope.contentList = rs.data.list;
				
				
				$scope.page = {
					pageCount: rs.data.pages,
					pageNum: rs.data.pageNum,
					pageSize: rs.data.pageSize,
					pageSizeList: $scope.pageSizeList,
					total: rs.data.total
				};
				
			} else {
				console.log("获取业务类型异常!");
				console.log(rs);
			}
		}).error(function (rs) {
			console.log("获取业务类型异常!");
			console.log(rs);
		});
	};
	
	$scope.getContentTypeList();
	
	//$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
	
	$scope.addBusinessContent = function () {
		 console.log("新增业务类型！");
		 
		 layer.open({
			type: 1,
			scroll: false,
			area: ['500px', '400px'], // 宽高
			title: '新增业务类型',
			btn: ["确定", "取消"],
			content: $(".addOrUpdate-businessContent-html"),
			success: function success(index) {
				$scope.contentType1 = $scope.pid;
				$scope.businessContent = "";
				$scope.score = "";
				$scope.money = "";
				$(".addOrUpdate-businessContent-html").removeClass("hide");
			},
			yes: function yes(index) {

				if (!$scope.businessContent) {
					layer.alert("请输入业务类型名称", { icon: 0 });
					return;
				}
				
				if (!$scope.score) {
					layer.alert("请输入奖励积分", { icon: 0 });
					return;
				}
				
				if (!$scope.money) {
					layer.alert("请输入奖励红包金额", { icon: 0 });
					return;
				}

				$http({
					method: "post",
					url: rootPath + "/admin/business_content/saveBusinessContent",
					data: {
						pid : $scope.contentType1,
						businessContent: $scope.businessContent,
						score : $scope.score,
						money : $scope.money
					}
				}).success(function (rs) {
					if (rs && (rs.code == 0 || rs.code == 20)) {
						console.log(rs);
						//刷新列表
						if(rs.code == 0){
							layer.msg('新增成功!');
							$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
							layer.close(index);
						}
						
						if(rs.code == 20){
							layer.alert(rs.message, { icon: 0 });
					    return;
						}
						
					} else {
						layer.msg('新增销售业务类型异常，请联系管理员!');
						layer.close(index);
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('新增销售业务类型异常，请联系管理员!');
					layer.close(index);
				});
				layer.close(index);
			}, end: function end() {
				$(".addOrUpdate-businessContent-html").addClass("hide");
			}
		});
		 
	};
	
	$scope.deleteBusinessContent = function(){
			console.log("批量删除");
			var sn = getCheckedVal("contentCheckbox");
		
			if (!sn) {
				layer.alert("请选择一个业务类型!", { "icon": 0 });
				return;
			}
			console.log(sn);
			layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
				
				$http({
					method: "post",
					url: rootPath + "/admin/business_content/batchDelBusinessContent?ids="+sn,
					data: {}
				}).success(function (rs) {
					if (rs && (rs.code == 0 || rs.code == 20)) {
						console.log(rs);
						//刷新列表
						if(rs.code == 0){
							layer.msg('删除成功!');
							$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
							layer.close(index);
						}
						
						if(rs.code == 20){
							layer.alert(rs.message, { icon: 0 });
					    return;
						}
						
					} else {
						layer.msg('删除失败，请联系管理员!');
						layer.close(index);
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('删除失败，请联系管理员!');
					layer.close(index);
				});
				
			});
	};
	
	$scope.updateBusinessContent = function (id,mypid,businessContent,score,money) {
		 console.log("修改业务类型！");
		 
		 layer.open({
			type: 1,
			scroll: false,
			area: ['500px', '400px'], // 宽高
			title: '修改业务类型',
			btn: ["确定", "取消"],
			content: $(".addOrUpdate-businessContent-html"),
			success: function success(index) {
				$scope.contentType1 = mypid;
				$scope.businessContent = businessContent;
				$scope.score = score;
				$scope.money = money;
				$(".addOrUpdate-businessContent-html").removeClass("hide");
			},
			yes: function yes(index) {

				if (!$scope.businessContent) {
					layer.alert("请输入业务类型名称", { icon: 0 });
					return;
				}

				$http({
					method: "post",
					url: rootPath + "/admin/business_content/updateBusinessContent",
					data: {
						id : id,
						pid : $scope.contentType1,
						businessContent: $scope.businessContent,
						score : $scope.score,
						money : $scope.money
					}
				}).success(function (rs) {
					if (rs && (rs.code == 0 || rs.code == 20)) {
						console.log(rs);
						//刷新列表
						if(rs.code == 0){
							layer.msg('修改成功!');
							$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
							layer.close(index);
						}
						
						if(rs.code == 20){
							layer.alert(rs.message, { icon: 0 });
					    return;
						}
						
					} else {
						layer.msg('修改销售业务类型异常，请联系管理员!');
						layer.close(index);
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('修改销售业务类型异常，请联系管理员!');
					layer.close(index);
				});
				layer.close(index);
			}, end: function end() {
				$(".addOrUpdate-businessContent-html").addClass("hide");
			}
		});
		 
	};
	


	$scope.one = false; //默认未选中
	$scope.all = false;
	$scope.checkAll = function () {
		$scope.infoTypeData.forEach(function (val) {
			val.checked = $scope.all;
		});
	};


    
});


businessContent2.filter("getContentType", function () {
	return function (input, data) {
		if (input == null || input === "") {
			return "输入为空！";
		}

		if (!data || data.length == 0) {
			return "字典为空!";
		}

		for (i in data) {
			if (input == data[i].id) {
				return data[i].businessContent;
			}
		}

		return "无";
	};
});

//获取URL带的参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
