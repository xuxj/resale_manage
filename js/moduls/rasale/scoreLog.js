var contractPlanType_js = [];
var app = angular.module('scoreLog', []);
//定义合约列表控制器
app.controller('scoreLog', function ($rootScope, $scope, $http, $timeout) {


	var path = window.location.protocol + '//' + window.location.host;
	var defaultPageSize = 10;
	$scope.scoreList = [];
	$scope.pageSizeList = [5,10,20];
	$scope.name = "";
	
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
			url: path + "/admin/user_info/pageScoreLog?pageNum="+pageObj.pageNum+"&pageSize="+pageObj.pageSize+"&name="+encodeURIComponent($("#name").val())+"&startDate="+$("#startDate").val()+"&endDate="+$("#endDate").val(),
			data: {}
		}).success(function (rs) {
			if (rs && rs.code == 0) {
				console.log(rs);
				$scope.scoreList = rs.data.list;
				
				
				$scope.page = {
					pageCount: rs.data.pages,
					pageNum: rs.data.pageNum,
					pageSize: rs.data.pageSize,
					pageSizeList: $scope.pageSizeList,
					total: rs.data.total
				};
				
			} else {
				console.log("获取积分数据异常!");
				console.log(rs);
			}
		}).error(function (rs) {
			console.log("获取积分数据异常!");
			console.log(rs);
		});
	};
	
	
		$scope.initData = function () {
			$("#startDate").val($scope.getCurrentDate());
			$("#endDate").val($scope.getCurrentDate());
			
			$scope.pageData({"pageNum":1,"pageSize":defaultPageSize});
	};
	
	$scope.initData();
	
	
    
});


//获取URL带的参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}
