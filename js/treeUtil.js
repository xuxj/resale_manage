var TreeUtil = function TreeUtil() {};

/**
 * 使用例子
 * <input id="unitName" type="text" readonly value="" class="form-control" style="width:200px"/>
 * <input id="unitId" type="hidden" />
 * <ul id="orgTree" class="ztree selectTree"></ul>
 
 * TreeUtil.selectTree("orgTree","inputId",unitData,function(e, treeId, treeNode){
		$("#unitId").val(treeNode.id);
		$("#unitName").val(treeNode.name);
    })
 */
TreeUtil.selectTree = function (treeId, inputId, treeData, onClick, beforeClick, btnId) {
	$('#' + treeId).css({ 'height': '260px', 'overflow': 'scroll' });
	if (!beforeClick) {
		beforeClick = function beforeClick() {
			$("#" + treeId).fadeOut("fast");
		};
	}
	var setting = {
		view: {
			dblClickExpand: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeClick: beforeClick,
			onClick: onClick
		}
	};
	$('#' + inputId).on('click', function () {
		$("#" + treeId).slideDown("fast");
		showMenu();
	});
	$('#' + btnId).on('click', function () {
		$("#" + treeId).slideDown("fast");
		console.log('1');
		showMenu();
	});
	function showMenu() {
		$("body").bind("mousedown", onBodyDown);
	}
	function hideMenu() {
		$("#" + treeId).fadeOut("fast");
		$("body").unbind("mousedown", onBodyDown);
	}
	function onBodyDown(event) {
		if (!($(event.target).parents("#" + treeId).length > 0)) {
			hideMenu();
		}
	}
	var orgTree = $.fn.zTree.init($("#" + treeId), setting, treeData);
	return orgTree;
};

TreeUtil.selectCheckTree = function (treeId, inputId, treeData, onClick, beforeClick) {
	$('#' + treeId).css({ 'height': '260px', 'overflow': 'scroll' });
	console.log('走起');
	debugger;
	var setting = {
		check: {
			enable: true
		},
		view: {
			dblClickExpand: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeClick: beforeClick,
			onClick: onClick
		}

	};
	$('#' + inputId).on('click', function () {
		$("#" + treeId).slideDown("fast");
	});
	var orgTree = $.fn.zTree.init($("#" + treeId), setting, treeData);
	console.log(orgTree);
	return orgTree;
};
//下拉多选树
TreeUtil.checkTree = function (treeId, inputPrix, treeData) {
	$('#' + treeId).css({ 'height': '260px', 'overflow': 'scroll' });
	if (!beforeClick) {
		beforeClick = function beforeClick() {
			$("#" + treeId).fadeOut("fast");
		};
	}
	var setting = {
		check: {
			enable: true
		},
		view: {
			dblClickExpand: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		callback: {
			beforeClick: beforeClick,
			onCheck: onCheck
		}

	};
	//var inputId = inputId;

	function beforeClick(treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj(treeId);
		zTree.checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	}

	function onCheck(e, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj(treeId),
		    nodes = zTree.getCheckedNodes(true),
		    v = "";
		var ids = [];
		var names = [];
		for (var i = 0, l = nodes.length; i < l; i++) {
			//if(nodes[i].isParent) continue;
			v += nodes[i].name + ",";
			ids.push(nodes[i].id);
			names.push(nodes[i].name);
		}
		$("#" + inputPrix + "Id").val(ids.join(","));
		$("#" + inputPrix + "Name").val(names.join(","));
	}

	function showMenu() {
		$("body").bind("mousedown", onBodyDown);
	}
	function hideMenu() {
		$("#" + treeId).fadeOut("fast");
		$("body").unbind("mousedown", onBodyDown);
	}
	function onBodyDown(event) {
		if (!($(event.target).parents("#" + treeId).length > 0)) {
			hideMenu();
		}
	}

	$('#' + inputPrix + "Name").on('click', function () {
		$("#" + treeId).slideDown("fast");
		showMenu();
	});
	//搜索按钮  出现下拉树
	$('#' + inputPrix + "SearchBtn").on('click', function () {
		$("#" + treeId).slideDown("fast");
		showMenu();
	});
	var orgTree = $.fn.zTree.init($("#" + treeId), setting, treeData);
	return orgTree;
};
