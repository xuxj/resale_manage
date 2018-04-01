var contractPlanType_js = [];
var app = angular.module('phoneType', []);
//定义合约列表控制器
app.controller('phoneType', function ($rootScope, $scope, $http, $timeout) {


	var path = window.location.protocol + '//' + window.location.host;
	var defaultPageSize = 10;
	$scope.typeList = [];
	$scope.pageSizeList = [5,10,20];
	
	$scope.isNotNull = function (param) {
		if (param == undefined || param === "") {
			return false;
		}
		return true;
	};

	
	$scope.pageData = function (pageObj) {
			
			console.log(pageObj.pageNum+"-------"+pageObj.pageSize);
			$http({
			method: "post",
			url: path + "/admin/phone_type/pagePhoneType?pageNum="+pageObj.pageNum+"&pageSize="+pageObj.pageSize,
			data: {}
		}).success(function (rs) {
			if (rs && rs.code == 0) {
				console.log(rs);
				$scope.typeList = rs.data.list;
				
				
				$scope.page = {
					pageCount: rs.data.pages,
					pageNum: rs.data.pageNum,
					pageSize: rs.data.pageSize,
					pageSizeList: $scope.pageSizeList,
					total: rs.data.total
				};
				
			} else {
				console.log("获取机型异常!");
				console.log(rs);
			}
		}).error(function (rs) {
			console.log("获取机型异常!");
			console.log(rs);
		});
	};
	
	$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
	
	$scope.addPhoneType = function () {
		 console.log("新增机型！");
		 
		 layer.open({
			type: 1,
			scroll: false,
			area: ['500px', '300px'], // 宽高
			title: '新增销售机型',
			btn: ["确定", "取消"],
			content: $(".addOrUpdate-phoneType-html"),
			success: function success(index) {
				$scope.phoneType = "";
				$(".addOrUpdate-phoneType-html").removeClass("hide");
			},
			yes: function yes(index) {

				if (!$scope.phoneType) {
					layer.alert("请输入机型名称", { icon: 0 });
					return;
				}

				$http({
					method: "post",
					url: rootPath + "/admin/phone_type/savePhoneType",
					data: {
						phoneType: $scope.phoneType
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
						layer.msg('新增销售机型异常，请联系管理员!');
						layer.close(index);
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('新增销售机型异常，请联系管理员!');
					layer.close(index);
				});
				layer.close(index);
			}, end: function end() {
				$(".addOrUpdate-phoneType-html").addClass("hide");
			}
		});
		 
	};
	
	$scope.deletePhoneType = function(){
			console.log("批量删除");
			var sn = getCheckedVal("typeCheckbox");
		
			if (!sn) {
				layer.alert("请选择一个机型!", { "icon": 0 });
				return;
			}
			console.log(sn);
			layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
				
				$http({
					method: "post",
					url: rootPath + "/admin/phone_type/batchDelPhoneType?ids="+sn,
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
	
	$scope.updatePhoneType = function (id,phoneType) {
		 console.log("修改机型！");
		 
		 layer.open({
			type: 1,
			scroll: false,
			area: ['500px', '300px'], // 宽高
			title: '修改销售机型',
			btn: ["确定", "取消"],
			content: $(".addOrUpdate-phoneType-html"),
			success: function success(index) {
				$scope.phoneType = phoneType;
				$(".addOrUpdate-phoneType-html").removeClass("hide");
			},
			yes: function yes(index) {

				if (!$scope.phoneType) {
					layer.alert("请输入机型名称", { icon: 0 });
					return;
				}

				$http({
					method: "post",
					url: rootPath + "/admin/phone_type/updatePhoneType",
					data: {
						id : id,
						phoneType: $scope.phoneType
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
						layer.msg('修改销售机型异常，请联系管理员!');
						layer.close(index);
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('修改销售机型异常，请联系管理员!');
					layer.close(index);
				});
				layer.close(index);
			}, end: function end() {
				$(".addOrUpdate-phoneType-html").addClass("hide");
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


//获取URL带的参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
