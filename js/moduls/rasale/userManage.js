var contractPlanType_js = [];
var app = angular.module('userManage', []);
//定义合约列表控制器
app.controller('userManage', function ($rootScope, $scope, $http, $timeout,$filter) {


	var path = window.location.protocol + '//' + window.location.host;
	var defaultPageSize = 10;
	$scope.userList = [];
	$scope.pageSizeList = [5,10,20];
	$scope.status = 0;
	$scope.userStatus = [
		{"id":0,"status":"待审核"},
		{"id":1,"status":"通过"},
		{"id":2,"status":"未通过"}
	];
	$scope.enableSubmit = true;
	$scope.exportSubmit = false;
	
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
			url: path + "/admin/user_info/getAllUser?pageNum="+pageObj.pageNum+"&pageSize="+pageObj.pageSize+"&status="+$scope.status,
			data: {}
		}).success(function (rs) {
			if (rs && rs.code == 0) {
				console.log(rs);
				$scope.userList = rs.data.list;
				
				
				$scope.page = {
					pageCount: rs.data.pages,
					pageNum: rs.data.pageNum,
					pageSize: rs.data.pageSize,
					pageSizeList: $scope.pageSizeList,
					total: rs.data.total
				};
				
			} else {
				console.log("获取用户数据异常!");
				console.log(rs);
			}
		}).error(function (rs) {
			console.log("获取用户数据异常!");
			console.log(rs);
		});
	};
	
	$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
	
	$scope.changeStatus = function(){
		console.log("change");
		console.log("status:----------"+$scope.status);
		$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
	}
	
	
	
	$scope.approve = function(id,status){
			$http({
					method: "post",
					url: rootPath + "/admin/user_info/userApproval?ids="+id+"&status="+status,
					data: {}
				}).success(function (rs) {
					if (rs && (rs.code == 0 || rs.code == 20)) {
						console.log(rs);
						//刷新列表
						if(rs.code == 0){
							layer.msg('操作成功!');
							$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
						}
						
						if(rs.code == 20){
							layer.alert(rs.message, { icon: 0 });
					    return;
						}
						
					} else {
						layer.msg('操作失败，请联系管理员!');
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('操作失败，请联系管理员!');
				});
	};
	
	$scope.exportData = function(){
		console.log("--------export");
		console.log($("#startDate").val()+"-------"+$("#endDate").val());
		$http({
			method: "get",
			url: path + "/admin/business_content/exportData?startDate="+$("#startDate").val()+"&endDate="+$("#endDate").val(),
			data: {}
		}).success(function (rs) {
			if (rs && rs.code == 0) {
				console.log(rs);
				
			} else {
				console.log("导出失败!");
				console.log(rs);
			}
		}).error(function (rs) {
			console.log("导出失败!");
			console.log(rs);
		});
	};
	
	
	$scope.fileChanged = function(ele){  
    $scope.files = ele.files;  
   
   console.log($scope.files);
   
		if(!$scope.files || $scope.files.length == 0){
			layer.alert("请选择excel文件", { icon: 0 });
			$scope.enableSubmit = true;
			$scope.$apply();
			return;
		}
		
		var name = $scope.files[0].name;
		
		console.log(name);
		
		var index = name.lastIndexOf(".");
		
		console.log(index);
		
		if(index<=0){
			layer.alert("请选择excel文件", { icon: 0 });
			$scope.enableSubmit = true;
			$scope.$apply();
			return;
		}
		
		var suffix = name.substring(index+1);
		
		console.log(suffix);
		
		if("xls" != suffix && "xlsx" != suffix){
			layer.alert("请选择excel文件", { icon: 0 });
			$scope.enableSubmit = true;
			$scope.$apply();
			return;
		}
		$scope.enableSubmit = false;
		$scope.$apply();
		 
   };
   
   $scope.importExcel = function(){
   		  var fd = new FormData();
        var file = $scope.files[0];
        fd.append('excelFile', file);
        console.log("----------------import");
         $http({
              method:'POST',
              url:"/admin/user_info/importData",
              data: fd,
              headers: {'Content-Type':undefined},
              transformRequest: angular.identity 
         }).success(function (rs) {
					if (rs && (rs.code == 0 || rs.code == 20)) {
						console.log(rs);
						//刷新列表
						if(rs.code == 0){
							layer.msg('导入成功!');
						}
						
						if(rs.code == 20){
							layer.alert(rs.message, { icon: 0 });
					    return;
						}
						
					} else {
						layer.msg('导入失败，请联系管理员!');
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('导入失败，请联系管理员!');
				}); 
   	};
	
	$scope.timeFormate = $filter("date")($scope.dt1, "yyyy-MM-dd HH:mm:ss");
	

    
});




//获取URL带的参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
