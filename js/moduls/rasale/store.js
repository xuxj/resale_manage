var contractPlanType_js = [];
var app = angular.module('store', []);
//定义合约列表控制器
app.controller('store', function ($rootScope, $scope, $http, $timeout) {


	var path = window.location.protocol + '//' + window.location.host;
	var defaultPageSize = 10;
	$scope.storeList = [];
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
			url: path + "/admin/store/pageStore?pageNum="+pageObj.pageNum+"&pageSize="+pageObj.pageSize,
			data: {}
		}).success(function (rs) {
			if (rs && rs.code == 0) {
				console.log(rs);
				$scope.storeList = rs.data.list;
				
				
				$scope.page = {
					pageCount: rs.data.pages,
					pageNum: rs.data.pageNum,
					pageSize: rs.data.pageSize,
					pageSizeList: $scope.pageSizeList,
					total: rs.data.total
				};
				
			} else {
				console.log("获取门店异常!");
				console.log(rs);
			}
		}).error(function (rs) {
			console.log("获取门店异常!");
			console.log(rs);
		});
	};
	
	$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
	
	$scope.addStore = function () {
		 console.log("新增门店！");
		 
		 layer.open({
			type: 1,
			scroll: false,
			area: ['500px', '300px'], // 宽高
			title: '新增门店',
			btn: ["确定", "取消"],
			content: $(".addOrUpdate-store-html"),
			success: function success(index) {
				$scope.storeName = "";
				$(".addOrUpdate-store-html").removeClass("hide");
			},
			yes: function yes(index) {

				if (!$scope.storeName) {
					layer.alert("请输入门店名称", { icon: 0 });
					return;
				}

				$http({
					method: "post",
					url: rootPath + "/admin/store/saveStore",
					data: {
						storeName: $scope.storeName
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
						layer.msg('新增门店异常，请联系管理员!');
						layer.close(index);
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('新增门店异常，请联系管理员!');
					layer.close(index);
				});
				layer.close(index);
			}, end: function end() {
				$(".addOrUpdate-store-html").addClass("hide");
			}
		});
		 
	};
	
	$scope.deleteStore = function(){
			console.log("批量删除");
			var sn = getCheckedVal("storeCheckbox");
		
			if (!sn) {
				layer.alert("请选择一个门店!", { "icon": 0 });
				return;
			}
			console.log(sn);
			layer.confirm('确认禁用？', { icon: 3, title: '提示' }, function (index) {
				
				$http({
					method: "post",
					url: rootPath + "/admin/store/batchDelStore?ids="+sn,
					data: {}
				}).success(function (rs) {
					if (rs && (rs.code == 0 || rs.code == 20)) {
						console.log(rs);
						//刷新列表
						if(rs.code == 0){
							layer.msg('禁用成功!');
							$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
							layer.close(index);
						}
						
						if(rs.code == 20){
							layer.alert(rs.message, { icon: 0 });
					    return;
						}
						
					} else {
						layer.msg('禁用失败，请联系管理员!');
						layer.close(index);
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('禁用失败，请联系管理员!');
					layer.close(index);
				});
				
			});
	};
	
	$scope.updateStore = function (id,storeName) {
		 console.log("修改机型！");
		 
		 layer.open({
			type: 1,
			scroll: false,
			area: ['500px', '300px'], // 宽高
			title: '修改门店名称',
			btn: ["确定", "取消"],
			content: $(".addOrUpdate-store-html"),
			success: function success(index) {
				$scope.storeName = storeName;
				$(".addOrUpdate-store-html").removeClass("hide");
			},
			yes: function yes(index) {

				if (!$scope.storeName) {
					layer.alert("请输入门店名称", { icon: 0 });
					return;
				}

				$http({
					method: "post",
					url: rootPath + "/admin/store/updateStore",
					data: {
						id : id,
						storeName: $scope.storeName
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
						layer.msg('修改门店名称异常，请联系管理员!');
						layer.close(index);
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('修改门店名称异常，请联系管理员!');
					layer.close(index);
				});
				layer.close(index);
			}, end: function end() {
				$(".addOrUpdate-store-html").addClass("hide");
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
