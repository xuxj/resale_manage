var contractPlanType_js = [];
var app = angular.module('level', []);
//定义合约列表控制器
app.controller('level', function ($rootScope, $scope, $http, $timeout) {


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
			url: path + "/admin/level/pageLevelInfo?pageNum="+pageObj.pageNum+"&pageSize="+pageObj.pageSize,
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
				console.log("获取等级信息异常!");
				console.log(rs);
			}
		}).error(function (rs) {
			console.log("获取等级信息异常!");
			console.log(rs);
		});
	};
	
	$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
	
	$scope.addLevel = function () {
		 console.log("新增等级！");
		 
		 layer.open({
			type: 1,
			scroll: false,
			area: ['520px', '330px'], // 宽高
			title: '新增等级信息',
			btn: ["确定", "取消"],
			content: $(".addOrUpdate-level-html"),
			success: function success(index) {
				$scope.level = "";
				$scope.score = "";
				$scope.minMoney = "";
				$scope.maxMoney = "";
				$(".addOrUpdate-level-html").removeClass("hide");
			},
			yes: function yes(index) {

				if (!$scope.level) {
					layer.alert("请输入等级名称", { icon: 0 });
					return;
				}
				
				if (!$scope.score) {
					layer.alert("请输入积分", { icon: 0 });
					return;
				}
				
				if (!$scope.minMoney) {
					layer.alert("请输入随机红包最小金额", { icon: 0 });
					return;
				}
				
				if (!$scope.maxMoney) {
					layer.alert("请输入随机红包最大金额", { icon: 0 });
					return;
				}
				
				if (parseFloat($scope.maxMoney) < parseFloat($scope.minMoney)) {
					layer.alert("请最大金额不可小与最小金额", { icon: 0 });
					return;
				}
				

				$http({
					method: "post",
					url: rootPath + "/admin/level/saveLevelInfo",
					data: {
						level: $scope.level,
						score: $scope.score,
						minMoney: $scope.minMoney,
						maxMoney: $scope.maxMoney
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
						layer.msg('新增等级信息异常，请联系管理员!');
						layer.close(index);
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('新增等级信息异常，请联系管理员!');
					layer.close(index);
				});
				layer.close(index);
			}, end: function end() {
				$(".addOrUpdate-level-html").addClass("hide");
			}
		});
		 
	};
	
	$scope.deleteLevel = function(){
			console.log("批量删除");
			var sn = getCheckedVal("levelCheckbox");
		
			if (!sn) {
				layer.alert("请选择一个等级!", { "icon": 0 });
				return;
			}
			console.log(sn);
			layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
				
				$http({
					method: "post",
					url: rootPath + "/admin/level/batchDelLevelInfo?ids="+sn,
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
	
	$scope.updateLevel = function (id,level,score,minMoney,maxMoney) {
		 console.log("修改等级信息！");
		 
		 layer.open({
			type: 1,
			scroll: false,
			area: ['520px', '330px'], // 宽高
			title: '修改等级信息',
			btn: ["确定", "取消"],
			content: $(".addOrUpdate-level-html"),
			success: function success(index) {
				$scope.level = level;
				$scope.score = score;
				$scope.minMoney = minMoney;
				$scope.maxMoney = maxMoney;
				$(".addOrUpdate-level-html").removeClass("hide");
			},
			yes: function yes(index) {

				if (!$scope.level) {
					layer.alert("请输入等级名称", { icon: 0 });
					return;
				}
				
				if (!$scope.score) {
					layer.alert("请输入积分", { icon: 0 });
					return;
				}
				
				if (!$scope.minMoney) {
					layer.alert("请输入随机红包最小金额", { icon: 0 });
					return;
				}
				
				if (!$scope.maxMoney) {
					layer.alert("请输入随机红包最大金额", { icon: 0 });
					return;
				}
				
				if (parseFloat($scope.maxMoney) < parseFloat($scope.minMoney)) {
					layer.alert("请最大金额不可小与最小金额", { icon: 0 });
					return;
				}

				$http({
					method: "post",
					url: rootPath + "/admin/level/updateLevelInfo",
					data: {
						id : id,
						level: $scope.level,
						score: $scope.score,
						minMoney: $scope.minMoney,
						maxMoney: $scope.maxMoney
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
						layer.msg('修改等级信息异常，请联系管理员!');
						layer.close(index);
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('修改等级信息异常，请联系管理员!');
					layer.close(index);
				});
				layer.close(index);
			}, end: function end() {
				$(".addOrUpdate-level-html").addClass("hide");
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
