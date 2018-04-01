var contractPlanType_js = [];
var app = angular.module('businessContent', []);
//定义合约列表控制器
app.controller('businessContent', function ($rootScope, $scope, $http, $timeout) {


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
			url: path + "/admin/business_content/pageBusinessContent?pid=-1&pageNum="+pageObj.pageNum+"&pageSize="+pageObj.pageSize,
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
	
	$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
	
	$scope.addBusinessContent = function () {
		 console.log("新增业务类型！");
		 
		 layer.open({
			type: 1,
			scroll: false,
			area: ['500px', '300px'], // 宽高
			title: '新增业务类型',
			btn: ["确定", "取消"],
			content: $(".addOrUpdate-businessContent-html"),
			success: function success(index) {
				$scope.businessContent = "";
				$(".addOrUpdate-businessContent-html").removeClass("hide");
			},
			yes: function yes(index) {

				if (!$scope.businessContent) {
					layer.alert("请输入业务类型名称", { icon: 0 });
					return;
				}

				$http({
					method: "post",
					url: rootPath + "/admin/business_content/saveBusinessContent",
					data: {
						pid : -1,
						businessContent: $scope.businessContent
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
	
	$scope.updateBusinessContent = function (id,businessContent) {
		 console.log("修改业务类型！");
		 
		 layer.open({
			type: 1,
			scroll: false,
			area: ['500px', '300px'], // 宽高
			title: '修改业务类型',
			btn: ["确定", "取消"],
			content: $(".addOrUpdate-businessContent-html"),
			success: function success(index) {
				$scope.businessContent = businessContent;
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
						businessContent: $scope.businessContent
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


//获取URL带的参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
