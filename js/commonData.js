var CommonData = function CommonData() {};

/**
 * 获取组织单元树数据
 */
/*CommonData.getOrgTreeData = function (callback) {
	
	var path = window.location.protocol + '//' + window.location.host;
	console.log("path:" + path);
	Ajax.get(path + "/nets-budget/org/org_tree_data_auth", function (unitData) {
		callback(unitData.data);
	});
};*/


CommonData.getOrgTreeData = function (callback) {
	Ajax.get("/nets-budget/org/org_tree_data", function (unitData) {
		callback(unitData);
	});
};
CommonData.getOrgTreeDataAuthQuery = function (callback) {
	Ajax.get("/nets-budget/org/org_tree_data_auth_query", function (unitData) {
		callback(unitData.data);
	});
};
/**
 * 获取用户树数据
 */
CommonData.getUserTreeData = function (callback) {
	Ajax.get(rootPath + "/org/user_tree_data", function (userData) {
		callback(userData);
	});
};

/**
 * 获取登录用户信息
 */
CommonData.getUserInfo = function (callback) {
	var path = window.location.protocol + '//' + window.location.host;
	Ajax.get(path + "/nets-budget/org/user_info", function (userData) {
		callback(userData);
	});
};

/**
 * 获取用户银行账号信息(id--用户id，整型)
 */
CommonData.getUserBankInfo = function (id, callback) {

	Ajax.post(rootPath + "/user_bank/list", { userId: id }, function (userBankData) {
		callback(userData);
	});
};

/**
 * 获取预算科目
 * @param year
 */
CommonData.getBudgetItem = function (year, callback) {
	var path = window.location.protocol + '//' + window.location.host;
	Ajax.get(path + "/nets-budget/item/item_tree_data?year=" + year, function (userData) {
		callback(userData);
	});
};
/**
 * 获取预算科目
 * 
 * @param year
 * @param type 多个用逗号分隔，收入类1，支出类2，其它类3，代收类4，代付类5
 */
CommonData.getBudgetItemByType = function (year,type, callback) {
	var path = window.location.protocol + '//' + window.location.host;
	Ajax.get(path + "/nets-budget/item/item_tree_data?year=" + year+"&type="+type, function (data) {
		callback(data);
	});
};
/**
 * 取业务号
 * @param bizPrefix 业务前缀
 */
CommonData.getFlowNo = function (bizPrefix, callback) {
	Ajax.get(rootPath + "/flow/getFlowNo?prefix=" + bizPrefix, function (data) {
		callback(data.message);
	});
};

/**
 * 获取流程待办
 * @param businessKey 业务Id
 * @param processDefinitionKey 流程定义Key
 */
CommonData.getFlowTask = function (processDefinitionKey, businessKey, callback) {
	Ajax.get(rootPath + "/flow/get_task?processDefinitionKey=" + processDefinitionKey + "&businessKey=" + businessKey, function (data) {
		if (!data.isSuccess) {
			layer.alert("获取流程待办失败：" + data.message);return;
		}
		callback(data.data);
	});
};

/***
 * 取字典
 * @param code 字典代码
 */
CommonData.getDict = function (code, callback) {
	Ajax.syncGet(rootPath + "/sys_dictionary/option/" + code, function (data) {
		callback(data.data);
	});
};

/***
 * 取付款性质
 * @year 年度
 * @categoryId 分类ID
 */
CommonData.getPayProperty = function (year, categoryId, callback) {
	var path = window.location.protocol + '//' + window.location.host;
	Ajax.get(path + "/nets-budget/pay_property/get_category_tree?categoryId=" + categoryId + "&year=" + year, function (data) {
		callback(data.data);
	});
};

/**
 * 单据是否归集期间控制
 * @year 年度
 * @code 单据编码
 * @return 是true/否false
 */
CommonData.isCollectPeriodControl = function (year, code, callback) {
	var path = window.location.protocol + '//' + window.location.host;
	Ajax.get(path + "/nets-budget/budget_param_set/is_collect_period_control?year=" + year + "&code=" + code, function (data) {
		if (!data.isSuccess) {
			layer.alert("归集期间获取失败：" + data.message);return;
		}
		callback(data.data);
	});
};

/**
 * 获取科目发票税率控制
 * @id 科目ID
 * @return 1是，0否
 */
CommonData.getItemRateControl = function (id, callback) {
	Ajax.get(rootPath + "/item/get_item_control_way?id=" + id, function (data) {
		if (!data.isSuccess) {
			layer.alert("预算科目控制方式获取失败：" + data.message);return;
		}
		callback(data.data);
	});
};

/**
 * 取预算参数设置的小数位数
 * 
 * @year 年度
 */
CommonData.getDecimalDigit = function (year, callback) {
	var path = window.location.protocol + '//' + window.location.host;
	Ajax.get(path + "/nets-budget/budget_param_set/get_by_paramYear?paramYear=" + year, function (data) {
		if (!data.isSuccess) {
			layer.alert("小数位数获取失败：" + data.message);
			return;
		}
		callback(data.data.decimalDigits);
	});
};

/**
 * 获取审批项的流程配置
 * 
 * @year 年度
 * @approveItemId 审批项ID
 */
CommonData.getApproveItemWfConfig = function (year, approveItemId, callback) {
	var path = window.location.protocol + '//' + window.location.host;
	Ajax.get(path + "/nets-budget/budget_param_set/get_wf_config?year=" + year + "&approveItemId=" + approveItemId, function (data) {
		if (!data.isSuccess) {
			layer.alert("小数位数获取失败：" + data.message);
			return;
		}
		callback(data.data);
	});
};

/**
 * 取预科目规则
 * @unitId 组织单元Id
 * @year 年度
 * @subjectId 科目Id
 */
CommonData.getRule = function (unitId, year, subjectId, callback) {
	Ajax.get(rootPath + "/subject_rule/get_rule?unitId=" + unitId + "&year=" + year + "&subjectId=" + subjectId, function (data) {
		if (!data.isSuccess) {
			layer.alert("获取失败科目规则失败：" + data.message);return;
		}
		callback(data.data);
	});
};

/**
 * 查询是否有可用余额
 * @param year
 * @param itemId 科目ID
 * @param unitId 单元ID
 * @param nonTaxMoney 不含税价
 * @return
 */
CommonData.checkSubjectBudgetBalance = function (collectDate, unitId, itemId, nonTaxMoney, callback) {
	Ajax.post(rootPath + "/noncontract_payment/check_subject_budget_balance", { "unitId": unitId, "collectDate": collectDate, "itemId": itemId, "nonTaxMoney": nonTaxMoney }, function (data) {
		if (!data.isSuccess) {
			layer.alert("查询科目预算余额失败：" + data.message);return;
		}
		callback(data.data);
	});
};

/**
 * 获取供应商银行
 */
CommonData.getSupplierBank = function (callback) {
	Ajax.get(rootPath + "/customer/org_supplier_bank", function (data) {
		if (!data.isSuccess) {
			layer.alert("获取供应商银行失败：" + data.message);return;
		}
		callback(data.data);
	});
};

/**
 * 已控制归集期间的单据类型
 */
CommonData.getAllowControl = function (year, callback) {
	Ajax.get(rootPath + '/collecting_period/get_by_paramYear?paramYear=' + year, function (data) {
		if (!data.isSuccess) {
			layer.alert('' + data.message);return;
		};
		callback(data.data);
	});
};

/**
 * 获取金蝶财务组织架构
 * @param {string} orgCode 组织架构code
 * @param {string} orgName 
 */
CommonData.getFinancialOrgUnitInfo = function (orgCode, orgName, call) {
	var path = window.location.protocol + '//' + window.location.host;
	if (orgCode) {
		//取得下级部门
		Ajax.post(path + '/nets-budget/org/get_financial_org_department', { code: orgCode }, function (data) {
			if (typeof call === 'function') {
				call(data);
			}
		});
	} else {
		//取得组织架构树
		Ajax.post(path + '/nets-budget/org/get_financial_org_unit_info', { name: orgName }, function (data) {
			if (typeof call === 'function') {
				call(data);
			}
		});
	}
};

/**
 * 获取预算科目
 * 科目属性(1:收入类；2：支出类；3：其他类)
 * @param year
 */
CommonData.getBudgetItemByParm = function (year, name, property, callback) {
	var model = {};
	model.year = year;
	model.name = name;
	model.property = property;
	Ajax.post(rootPath + "/item/item_tree_data_parm", model, function (userData) {
		callback(userData);
	});
};