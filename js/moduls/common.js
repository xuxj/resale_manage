var services = angular.module('energyservices', []);

//功能服务
services.factory('functionservice', function ($http) {
  return {

    //初始组织结构树空间
    initOrgTree: function initOrgTree() {
      CommonData.getOrgTreeData(function (unitData) {
        var firstNode = unitData[0];
        $("#unitId").val(firstNode.id);
        $("#unitName").val(firstNode.name);
        TreeUtil.selectTree("orgTree", "unitName", unitData, function (e, treeId, treeNode) {
          $("#unitId").val(treeNode.id);
          $("#unitName").val(treeNode.name); //如果要获取unitId 请使用js 方式$("#unitId").val();
        });
      });
    },

    //获取组织结构
    getOrgTree: function getOrgTree(queryParam, callback) {
      $http.get(rootPath + "/org/org_tree_data", queryParam).success(function (data) {
        console.log(data);
        callback(data);
      });
    },

    //获取组织结构
    getUserOrgInfo: function getUserOrgInfo(queryParam, callback) {
      $http.post(rootPath + "/org/user_org_info", queryParam).success(function (data) {
        console.log(data);
        callback(data);
      });
    },

    //查询人员
    getPersonByOrgId: function getPersonByOrgId(queryParam, callback) {
      $http.post(rootPath + "/user_info/org_user_data", queryParam).success(function (data) {
        console.log(data);
        callback(data);
      });
    },

    //获取所有仪表类型
    getMeterTypes: function getMeterTypes(callback) {
      var meterTypes;
      $http.post(rootPath + "/meter_type/all").success(function (data) {
        console.log(data);
        callback(data);
      });
    },

    //查询仪表
    getMeters: function getMeters(queryParam, callback) {
      var meterTypes;
      $http.post(rootPath + "/meter/page", queryParam).success(function (data) {
        console.log(data);
        meterTypes = data.data;
        callback(meterTypes);
      });
    },

    getMeterTypeNameByTypeId: function getMeterTypeNameByTypeId(id, meterTypes) {
      console.log("getMeterTypeNameByTypeId");
      console.log(meterTypes);
      console.log(id);
      for (var i = 0; i < meterTypes.length; i++) {
        var result = {};
        var type = meterTypes[i];
        if (type.meterTypeId == id) {
          result = type.meterTypeName;
          break;
        }
      }
      return result;
    },

    //从maps中以key获取value(参数value=null) 或者以value获取key(参数key=null)
    getKeyOrValue: function getKeyOrValue(key, value, maps) {
      if (key != null) {
        for (var i = 0; i < maps.length; i++) {
          var type = maps[i];
          if (type.k == key) {
            return type.v;
          }
          return null;
        }
      }
      if (value != null) {
        for (var i = 0; i < maps.length; i++) {
          var type = maps[i];
          if (type.v == value) {
            return type.k;
          }
          return null;
        }
      }
    },

    //获取当前时间
    getNowFormatDate: function getNowFormatDate() {
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
      console.log(currentdate);
      return currentdate;
    },
    //初始化仪表类型下拉复选框(kvMapArray=[{k:"",v:"",checked:true}])
    initMultiSelect: function initMultiSelect(elementId, kvMapArray, selectedValues) {

      var options = [];
      for (var i = 0; i < kvMapArray.length; i++) {
        var type = kvMapArray[i];
        var option = {};
        option.label = type.k;
        option.title = type.k;
        option.value = type.v;
        options.push(option);
      }

      /*var options = [
              {label: 'Option 1', title: 'Option 1', value: '1', selected: true},
              {label: 'Option 2', title: 'Option 2', value: '2'}
              ];*/
      //example-getting-started
      $('#' + elementId).multiselect('dataprovider', options);
      if (selectedValues != null) {
        $('#' + elementId).multiselect('select', selectedValues);
      }
    },

    //获取多选下拉框的值(使用逗号分隔方式)
    getMultiSelectValue: function getMultiSelectValue(elemenId) {
      var result = "";
      var value = $('#' + elemenId).val();
      if (value != null) {
        for (var i = 0; i < value.length; i++) {
          result = result + "," + value[i];
        }
      }
      console.log(value);
      return result;
    },

    //获取策略描述信息(strategy $scope中存储的数据格式)(其中数据对应的日期全部按java calendar 数据定义解析)
    getStrategyMsg: function getStrategyMsg(strategy) {

      var formateArray = function formateArray(str) {
        if (str == null) {
          return;
        }
        var target = [];
        var array = str.split(",");
        for (var i = 0; i < array.length; i++) {
          var item = array[i];
          if (item == "") {
            continue; //去掉无效字符
          }
          var num = parseInt(item);
          target.push(num);
        }
        return target;
      };

      var getWeekDay = function getWeekDay(array) {
        if (array == null) {
          return;
        }
        var wdMsg = "";
        for (var i = 0; i < array.length; i++) {
          var temp = array[i];
          switch (temp) {
            case 1:
              wdMsg = wdMsg + " 周日";
              break;
            case 2:
              wdMsg = wdMsg + " 周一";
              break;
            case 3:
              wdMsg = wdMsg + " 周二";
              break;
            case 4:
              wdMsg = wdMsg + " 周三";
              break;
            case 5:
              wdMsg = wdMsg + " 周四";
              break;
            case 6:
              wdMsg = wdMsg + " 周五";
              break;
            case 7:
              wdMsg = wdMsg + " 周六";
              break;
            default:

          }
        }
        return wdMsg;
      };

      var getWeekNum = function getWeekNum(array) {
        if (array == null) {
          return;
        }
        var wnMsg = "";
        for (var i = 0; i < array.length; i++) {
          var temp = array[i];
          switch (temp) {
            case 1:
              wnMsg = wnMsg + " 第1周";
              break;
            case 2:
              wnMsg = wnMsg + " 第2周";
              break;
            case 3:
              wnMsg = wnMsg + " 第3周";
              break;
            case 4:
              wnMsg = wnMsg + " 第4周";
              break;
            case 9:
              wnMsg = wnMsg + " 最后一周";
              break;
            default:

          }
        }
        return wnMsg;
      };

      var getMonth = function getMonth(array) {
        if (array == null) {
          return;
        }
        var mtMsg = "";
        for (var i = 0; i < array.length; i++) {
          var temp = array[i];
          var tempMonthNum = temp + 1;
          mtMsg = mtMsg + " " + tempMonthNum + "月";
        }
        return mtMsg;
      };

      var getDate = function getDate(array) {
        if (array == null) {
          return;
        }
        var dtMsg = "";
        for (var i = 0; i < array.length; i++) {
          var tempDateNum = array[i];
          dtMsg = dtMsg + " " + tempDateNum;
        }
        return dtMsg;
      };

      var msg = "";
      var mode = strategy.mode;
      var startTime = strategy.startTime;
      var interval = strategy.interval;

      var weekDay = strategy.weekDay;
      var weekDay_array = formateArray(weekDay);
      var weekDayMsg = getWeekDay(weekDay_array); //获取周几信息

      var monthNum = strategy.monthNum;
      var monthNum_array = formateArray(monthNum);
      var monthNumMsg = getMonth(monthNum_array); //获取月份信息

      var monthMode = strategy.monthMode;

      var monthDay = strategy.monthDay;
      var monthDay_array = formateArray(monthDay);
      var monthDayMsg = getDate(monthDay_array); //获取日期信息

      var weekNum = strategy.weekNum;
      var weekNum_array = formateArray(weekNum);
      var weekNumMsg = getWeekNum(weekNum_array); //获取第几周

      msg = "开始时间:" + startTime;
      switch (mode) {
        case 1:
          msg = "生成一次   " + msg;
          break;
        case 2:
          msg = "按天生成   " + msg;
          msg = msg + " 间隔:" + interval + "天";
          break;
        case 3:
          msg = "按周生成   " + msg;
          msg = msg + " 间隔:" + interval + "周";
          msg = msg + " 每周:" + weekDayMsg;
          break;
        case 4:
          msg = "按月生成   " + msg;
          msg = msg + " 月份:" + monthNumMsg;
          switch (monthMode) {
            case 1:
              msg = msg + " 日期:" + monthDayMsg;
              break;
            case 2:
              msg = msg + " 周次:" + weekNumMsg;
              msg = msg + " 每周:" + weekDayMsg;
              break;
            default:

          }
          break;
      }

      return msg;
    }

  };
});

//数据服务
services.factory('dataservice', function () {
  //时间单位
  timeUnit = [{ "k": "分钟", "v": 12 }, { "k": "小时", "v": 10 }, { "k": "天", "v": 5 }, { "k": "月", "v": 2 }, { "k": "年", "v": 1 }];
  //计划类型
  var planTypes = [{ "k": "年度", "v": 1 }, { "k": "季度", "v": 2 }, { "k": "月度", "v": 3 }];
  //计划状态
  var planStatus = [{ "k": "待审核", "v": 1 }, { "k": "审核中", "v": 2 }, { "k": "已审批'h", "v": 3 }];
  //工作状态
  var workStatus = [{ "k": "未完成", "v": 0 }, { "k": "完成", "v": 1 }];
  //仪表状态
  var meterStatus = [{ "k": "异常", "v": 0 }, { "k": "正常", "v": 1 }];

  var service = {
    data_timeUnit: timeUnit,
    data_planTypes: planTypes,
    data_planStatus: planStatus,
    data_workStatus: workStatus,
    data_meterStatus: meterStatus
  };
  return service;
});

//键值过滤器，用键为参数输出值或者用值输出键 map 结构: map={"k":"v1","v":"v2"}
services.filter('kovfilter', function () {
  return function (input, mode, maps) {
    var result = {};
    if (mode == "key") {
      for (var i = 0; i < maps.length; i++) {
        var type = maps[i];
        if (type.k == input) {
          result = type.v;
        }
      }
    }
    if (mode == "value") {
      for (var i = 0; i < maps.length; i++) {
        var type = maps[i];
        if (type.v == input) {
          result = type.k;
        }
      }
    }
    return result;
  };
});

//以仪表的类型id输出仪表类型名称
services.filter('meterNamefilter', function () {
  return function (input, meterTypes) {
    var result = {};
    for (var i = 0; i < meterTypes.length; i++) {
      console.log(meterTypes[i]);
      var type = meterTypes[i];
      console.log(type);
      if (type.meterTypeId == input) {
        result = type.meterTypeName;
      }
    }
    return result;
  };
});
