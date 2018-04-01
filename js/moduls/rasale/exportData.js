var contractPlanType_js = [];
var app = angular.module('exportData', []);
//定义合约列表控制器
app.controller('exportData', function ($rootScope, $scope, $http, $timeout) {


	var path = window.location.protocol + '//' + window.location.host;
	var defaultPageSize = 10;
	$scope.pageSizeList = [5,10,20];
	$scope.enableSubmit = true;
	$scope.exportSubmit = false;
	
	$scope.status = 0;
	$scope.saleStatus = [
		{"id":0,"status":"待审核"},
		{"id":1,"status":"通过"},
		{"id":2,"status":"未通过"}
	];
	//$scope.stores = [{"id":'',"storeName":"---请选择---"}];
	$scope.stores = [{"id":0,"storeName":"------请选择------"}];
	
	var selectedStatus = 0;
	
	$scope.isNotNull = function (param) {
		if (param == undefined || param === "") {
			return false;
		}
		return true;
	};
	
	$scope.getCurrentDate = function(){
   	var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  };
  
  	$scope.pageData = function (pageObj) {
			
			console.log(pageObj.pageNum+"-------"+pageObj.pageSize);

			$http({
			method: "post",
			url: path + "/admin/user_info/pageSaleLog1"+"?pageNum="+pageObj.pageNum+"&pageSize="+pageObj.pageSize,
			data: {
			  status:$scope.status,
			  saleName:$scope.name,
			  phoneNumber:$scope.phoneNumber,
			  storeId:$scope.storeId,
			  startCreateTime:$("#startDate").val(),
			  endCreateTime:$("#endDate").val()
			}
		}).success(function (rs) {
			if (rs && rs.code == 0) {
				console.log(rs);
				$scope.saleList = rs.data.list;
				
				
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
	
	

	
	$scope.initData = function () {
		
		    $("#agreeBtn").attr("disabled",true);  
		    $("#disagreeBtn").attr("disabled",true);
		
			$("#startDate").val($scope.getCurrentDate());
			$("#endDate").val($scope.getCurrentDate());
			
			//获取门店数据
			$http({
			method: "get",
			url: path + "/admin/store/listStore",
			data: {}
		}).success(function (rs) {
			if (rs && rs.code == 0) {
				console.log(rs);
				$scope.stores = $scope.stores.concat(rs.data);
				$scope.storeId = 0;
				$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
			} else {
				console.log("获取门店数据失败!");
				console.log(rs);
			}
		}).error(function (rs) {
			console.log("获取门店数据失败!");
			console.log(rs);
		});
			
			
	};
	
	$scope.initData();
	
	$scope.changeStatus = function(){
		console.log("change");
		console.log("status:----------"+$scope.status);
		$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
		
		//如果是已审核的，则禁用通过和不通过按钮
		if($scope.status == 0){//启用
			$("#agreeBtn").attr("disabled",false);  
			$("#disagreeBtn").attr("disabled",false);
		}else if($scope.status == 1){//通过
			$("#agreeBtn").attr("disabled",true);  
			$("#disagreeBtn").attr("disabled",true);  
		}else{
			$("#agreeBtn").attr("disabled",false);
			$("#disagreeBtn").attr("disabled",true);
		}
	}
	
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
              url:"/admin/business_content/importData",
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
   	
   	$scope.approval = function(status){
			console.log("批量审批");
			var sn = getCheckedVal("saleCheckbox");
		
			if (!sn) {
				layer.alert("请选择一个记录!", { "icon": 0 });
				return;
			}
			console.log(sn);
			layer.confirm('确认审批？', { icon: 3, title: '提示' }, function (index) {
				
				$http({
					method: "post",
					url: rootPath + "/admin/business_content/saleApproval?status="+status+"&ids="+sn,
					data: {}
				}).success(function (rs) {
					if (rs && (rs.code == 0 || rs.code == 20)) {
						console.log(rs);
						//刷新列表
						if(rs.code == 0){
							layer.msg('审批成功!');
							$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
							layer.close(index);
						}
						
						if(rs.code == 20){
							layer.alert(rs.message, { icon: 0 });
					    return;
						}
						
					} else {
						layer.msg('审批失败，请联系管理员!');
						layer.close(index);
					}
				}).error(function (rs) {
					console.log(rs);
					layer.msg('审批失败，请联系管理员!');
					layer.close(index);
				});
				
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