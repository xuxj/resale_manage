function createElement(html) {
	var div = document.createElement('div');
	div.innerHTML = html;
	var r = div.children[0];
	div = null;
	return r;
}

/**
 * SpreadJs.Views Loading.. 动画
 * @param jqdom
 * @param text
 * @returns
 */
function beginLoad(jqdom, text) {
	return;
	var icon = $('#custom-loadIcon');
	if (icon) {
		icon.style.display = '';
	}

	var background = createElement('<div id="backgroundOverlay" class="gc-popup-overlay"><div style="position: fixed;left:45%;top:45%"><div class="sk-cube-grid">' + '<div class="sk-cube sk-cube1"></div>' + '<div class="sk-cube sk-cube2"></div>' + '<div class="sk-cube sk-cube3"></div>' + '<div class="sk-cube sk-cube4"></div>' + '<div class="sk-cube sk-cube5"></div>' + '<div class="sk-cube sk-cube6"></div>' + '<div class="sk-cube sk-cube7"></div>' + '<div class="sk-cube sk-cube8"></div>' + '<div class="sk-cube sk-cube9"></div>' + '</div>' + '<h3 style="left:-35%;position: relative;color:white">' + text + '</h3>' + '</div></div>');

	//$('#queryBuilderContainer').append(background);
	jqdom.append(background);
}

function endLoad() {
	return;
	var icon = document.getElementById('custom-loadIcon');
	if (icon) {
		icon.style.display = 'none';
	}
	$('#backgroundOverlay').remove();
}

var Tools = {
	firstPageName: '主页'
};

/**
 * 下拉年份选择
 * @param {object} $dom
 * @returns {object}
 */
Tools.yearControl = function ($dom) {

	var date = new Date();
	var year = date.getFullYear();
	var yearList = this.getJsonData('/periodManaged/get_period_list');
	var sel = '';
	yearList.forEach(function (v, i, a) {
		if (v.text == year) {
			sel += '<option value="' + year + '" selected>' + year + '</option>';
		} else {
			sel += '<option value="' + v.text + '">' + v.text + '</option>';
		}
	});
	$dom.html(sel);
};

/**
 * 返回年份列表
 * @param {number} year - 年份
 * @returns {string}
 */
Tools.getYearList = function (year) {
	var yearList = [];
	year = year - 6;
	for (var i = 0; i < 5; i++) {
		year++;
		yearList.push({ value: year, text: year });
	}
	year++;
	yearList.push({ value: year, text: year });
	for (var j = 0; j < 5; j++) {
		year++;
		yearList.push({ value: year, text: year });
	}
	return yearList;
};

/**
 * 返回下拉年份选择对象
 * @param {object} $dom
 * @returns {object}
 */
Tools.currentYearControl = function ($dom) {
	var date = new Date();
	var year = date.getFullYear();
	year = year - 6;
	var sel = "";
	for (var i = 0; i < 5; i++) {
		year++;
		sel += '<option value="' + year + '">' + year + '</option>';
	}
	year++;
	sel += '<option value="' + year + '" selected>' + year + '</option>';
	for (var i = 0; i < 5; i++) {
		year++;
		sel += '<option value="' + year + '">' + year + '</option>';
	}
	$dom.html(sel);
};

/**
 * 内容长度验证所示器
 * @param inpObj
 * @param lblObj
 * @param limitLength
 */
Tools.validTextLength = function (inpObj, lblObj, limitLength) {

	var length = limitLength;
	var inputlength = $.trim(inpObj.val()).length;
	if (inputlength <= length) {
		lblObj.text(inputlength + "/" + length);
	} else {
		inpObj.val(inpObj.val().substring(0, length + 1));
	}
};

/**
 * 检查变量是否定义、为空
 * @param {mixed} sth 
 * @returns {boolean}
 */
Tools.isNullOrEmpty = function (sth) {
	if (typeof sth === 'undefined' || sth === null || sth.length <= 0) return true;
	return false;
};

/**
 * 为有maxlength的input、area生成长度指示label
 * 说明：
 * 		动态给输入框赋值，则需要在赋值后再调用，以便计算已经输入长度，生成相应的长度验证label
 * @param {object} $dom - 文档jq对象
 */
Tools.initInputLengthLabel = function ($dom) {
	var $ibox = $dom; // || $(".ibox-content");
	if (!$ibox) {
		throw new Error('请设置$dom');
		return;
	}
	var $ctlObj = $ibox.find('input, textarea');
	for (var i = 0; i < $ctlObj.length; i++) {
		var $tmpCtlObj = $($ctlObj[i]);
		var style = $tmpCtlObj.attr('style') || '';
		if (style.indexOf('width') < 0) {
			$tmpCtlObj.css({ "width": "85%" });
		}
		$tmpCtlObj.css({ "display": "inline-block" });
		var ctlId = $tmpCtlObj.attr("id");
		var ctlMaxLength = $tmpCtlObj.attr("maxlength");
		if (!this.isNullOrEmpty(ctlMaxLength)) {
			var labelId = ctlId + "-len";
			var tmpLabelId = "#" + labelId;
			var $label = $(tmpLabelId);
			if ($ibox.find(tmpLabelId).length > 0) {
				$label.html('0/' + ctlMaxLength);
			} else {
				$label = $('<label id="' + labelId + '" class="' + ctlId + '-label">0/' + ctlMaxLength + '</label>');
				$tmpCtlObj.after($label);
			}
			Tools.validTextLength($tmpCtlObj, $('#' + $tmpCtlObj.attr('id') + '-len'), $tmpCtlObj.attr('maxlength'));
			$tmpCtlObj.on('input', function () {
				Tools.validTextLength($(this), $('#' + $(this).attr('id') + '-len'), $(this).attr('maxlength'));
			});
		}
	}
};

/**
 * 表单验证：必填等~~
 * 说明：
 * 		1、长度验证，在控件上加入html5的required属性；
 * @param {object} $form - 表单jq对象
 * @returns {boolean}
 */
Tools.validForm = function ($form) {
	var $tmpForm = $form || $($("form")[0]);
	if (!$tmpForm) {
		return;
	}
	var $tmpCtlObj = $tmpForm.find('input, textarea, select');
	for (var i = 0; i < $tmpCtlObj.length; i++) {
		if ($tmpCtlObj[i].required) {
			var $v = $($tmpCtlObj[i]);
			var value = $v.val();
			if (Tools.isNullOrEmpty(value)) {
				return false;
			}
		}
	}
	return true;
};
Tools.validEmpty = function ($form) {
	var $tmpForm = $form || $($("form")[0]);
	if (!$tmpForm) {
		return;
	}
	var $tmpCtlObj = $tmpForm.find('input, textarea, select');
	for (var i = 0; i < $tmpCtlObj.length; i++) {
		if ($tmpCtlObj[i].required) {
			var $v = $($tmpCtlObj[i]);
			var value = $v.val();
			if (this.isNullOrEmpty(value)) {
				this._getValidLabel($v, 0);
				return msg.concat('不能为空');
			}
		}
	}
};
/**
 * <div class="form-group">
 * 		<label class="control-label"></label>
 * 		<div>
 *			<input type="text"/> 
 * 		</div>
 *		<label class="control-label"></label>
 *		<div>
 *			<input type="text"/>
 *		</div>	 
 * </div>
 */
var _seed = 10;
var msg = '';
Tools._getValidLabel = function ($ipt, start) {
	if (_seed > start) {
		try {
			var $label = $ipt.parent().prev();
			if (!Tools.isNullOrEmpty($label)) {
				if ($label.prop('class').indexOf('control-label') >= 0) msg = $label.html() || '';
			} else {
				this._getValidLabel($ipt.parent(), start++);
			}
		} catch (ex) {
			return '';
		}
	}
};

/**
 * 获取网站应用主目录
 * @returns {string}
 */
Tools.getRootPath = function () {
	var pathName = window.location.pathname.substring(1);
	var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
	if (webName == "") {
		return window.location.protocol + '//' + window.location.host;
	} else {
		return window.location.protocol + '//' + window.location.host + '/' + webName;
	}
};

/**
 * 返回系统下拉列表(t_select_option)
 * @param {object} $select - 下拉列表jq对象
 * @param {string} category - 列表分类
 * @returns {object}
 */
Tools.getSelectOption = function ($select, category) {
	var data = this.getJsonData('/selectOption/option_selectvalue?selectValues=' + category);
	var sel = '';
	$select.html('');
	for (var i = 0; i < data.length; i++) {
		sel += '<option value="' + data[i].optionValue + '">' + data[i].optionDisplay + '</option>';
	}
	$select.append(sel);
};
/**
 * 返回模板下拉列表
 * @param {object} $select - 下拉列表jq对象
 * @param {string} year - 预算年度 
 * @returns {object}
 */
Tools.getSelectTplOption = function ($select, year) {
	var data = this.getJsonData('/template/get_all_by', { year: year });
	var sel = '';
	sel = $select.html();
	$select.html('');
	data.forEach(function (value, index, array) {
		try {
			if (!Tools.isNullOrEmpty(value.fileIdTxt)) {
				if (value.hasOwnProperty('fileId')) {
					sel += '<option value="' + value.id + '" fileid="' + value.fileId + '">' + value.name + '</option>';
				} else {
					sel += '<option value="' + value.id + '">' + value.name + '</option>';
				}
			}
		} catch (ex) {
			sel += '<option>' + ex + '</option>';
		}
	});
	$select.append(sel);
};
/**
 * 获取组合条件
 * @param {string} dsname 数据集id 
 * @returns {string}
 */
Tools.getCondition = function (dsname) {
	var data;
	try {
		data = this.getJsonData('/dataset_condition_param/query_for_list', { datasetName: dsname });
	} catch (ex) {}
	return data;
};
/**
 * 根据模板名称返回文件磁盘存储file_id
 * @param {string} tplName - 模板名称
 * @param {function} call - 回调函数
 * @returns {string}
 */
Tools.getTemplateFileId = function (tplName, call) {
	tplName = $.trim(tplName);
	var data = this.getJsonData('/template/get_all_by', { name: tplName });
	if (this.isNullOrEmpty(data)) return -1;
	if (!data[0].hasOwnProperty('fileIdTxt')) {
		alert('没有字段fileIdTxt');
		return '';
	}
	if (typeof call === 'function') {
		call(data[0].fileIdTxt);
	}
	return data[0].fileIdTxt;
};
/**
 * 根据file_id返回模板文件json
 * @param {string} file_id - 存储文件id
 * @param {function} call - 回调函数
 * @returns {string}
 */
Tools.getTemplate = function (file_id, call) {
	var data = this.getJsonData('/sys_file/download_json', { id: file_id });
	//var data = this.getJsonData('/template/get_tpl_by_name', { name: '2017年物业预算-指标' });
	//模板文件有空格，单独处理
	if (typeof call === 'function') {
		call($.trim(data));
	}
	return $.trim(data);
};

/**
 * 请求远程返回json数据
 * @param {string} url - 请求地址
 * @param {object} data - 请求参数对象
 * @returns {string} 
 */
Tools.getJsonData = function (url, data) {
	if (this.isNullOrEmpty(url)) return '';
	var data;
	$.ajax({
		url: Tools.getRootPath() + url,
		type: 'POST',
		async: false,
		dataType: 'json',
		data: data
	}).done(function (result) {
		if (result.isSuccess) {
			data = result.data;
		}
	}).fail(function () {
		data = '';
	});
	return data;
};

/**
 * 新建时，移除“主页”外的Sheet
 * @param {object} spread
 */
Tools.removeSubSheet = function (spread) {
	if (this.isNullOrEmpty(spread)) {
		return;
	}
	var sheetCount = spread.getSheetCount();
	try {
		for (var i = 0; i < sheetCount; i++) {
			var sheet = spread.getSheet(i);
			if (!this.isNullOrEmpty(sheet) && $.trim(sheet.name()) !== '主页') {
				spread.removeSheet(i);
			}
		}
	} catch (indexOutOf) {}
};
/**
 * 获取sheet
 */
Tools.getSheet = function (spread, sheetName) {
	if (this.isNullOrEmpty(spread)) return;
	var sheetCount = spread.getSheetCount();
	try {
		for (var i = 0; i < sheetCount; i++) {
			var sheet = spread.getSheet(i);
			if (!this.isNullOrEmpty(sheet) && $.trim(sheet.name()) === $.trim(sheetName)) {
				return sheet;
			}
		}
	} catch (indexOutOf) {}
};

/**
 * 返回SpreadJs.Sheets树形节点初始化的TreeNodeCellType类型
 * @param {object} ns - GC.Spread.Sheets
 * @returns {object}
 */
Tools.initSpreadTreeNode = function (ns) {

	//自定义序列化特性
	function TreeNodeCellType() {
		this.typeName = "mynamespace.TreeNodeCellType";
	}

	if (!mynamespace) {
		//var mynamespace = {};
		return;
	}

	mynamespace.TreeNodeCellType = TreeNodeCellType;

	TreeNodeCellType.prototype = new ns.CellTypes.Text();
	//重绘单元格
	TreeNodeCellType.prototype.paint = function (ctx, value, x, y, w, h, style, options) {

		//当前层级
		var level = options.sheet.rowOutlines.getLevel(options.row);
		var nlevel = -1;
		if (options.row < options.sheet.getRowCount() - 1) {
			nlevel = options.sheet.rowOutlines.getLevel(options.row + 1);
		}
		var hoffset = (level + 2) * 12;
		x += hoffset;
		w -= hoffset;

		GC.Spread.Sheets.CellTypes.Base.prototype.paint.apply(this, arguments);

		if (options.row == options.sheet.getRowCount() - 1) return; //last row

		if (nlevel > level) {
			var collapsed = options.sheet.rowOutlines.isCollapsed(options.row + 1);

			x--;
			y += h / 2 - 3;
			ctx.save();
			ctx.fillStyle = "black";
			ctx.beginPath();
			if (collapsed) {
				ctx.moveTo(x - 5, y);
				ctx.lineTo(x, y + 3);
				ctx.lineTo(x - 5, y + 6);
			} else {
				ctx.moveTo(x, y);
				ctx.lineTo(x, y + 5);
				ctx.lineTo(x - 5, y + 5);
			}
			ctx.fill();
			ctx.restore();
		} else {
			x--;
			y += h / 2 - 3;
			ctx.save();
			ctx.restore();
		}
	};
	// override getHitInfo to allow cell type get mouse messages
	TreeNodeCellType.prototype.getHitInfo = function (x, y, cellStyle, cellRect, context) {
		return {
			x: x,
			y: y,
			row: context.row,
			col: context.col,
			cellStyle: cellStyle,
			cellRect: cellRect,
			sheetArea: context.sheetArea
		};
	};
	TreeNodeCellType.prototype.processMouseDown = function (hitinfo) {
		var level = hitinfo.sheet.rowOutlines.getLevel(hitinfo.row);
		var hoffset = (level + 2) * 12 + hitinfo.cellRect.x;
		if (hitinfo.x < hoffset && hitinfo.x > hoffset - 10) {
			var collapsed = hitinfo.sheet.rowOutlines.isCollapsed(hitinfo.row + 1);
			hitinfo.sheet.rowOutlines.setCollapsed(hitinfo.row, !collapsed);
			hitinfo.sheet.invalidateLayout();
			hitinfo.sheet.repaint();
		}
	};

	return new TreeNodeCellType();
};

var MessageBox = {};
MessageBox.show = function (msg) {
	try {
		GC.Spread.Sheets.designer.MessageBox.show(msg, '提示', 1 /* error */, 0 /* okCancel */, null);
	} catch (NotImportDesignerJs) {
		alert(msg);
	}
};

/**
 * 返回加载预算科目的Sheet
 * @param {object} spread - GC.Spread.Sheets.findControl(document.getElementById('ss'))
 * @param {object} ns - GC.Spread.Sheets
 * @param {string} year - 预算年份
 * @param {object} treeCellNodeType 树节点类型
 * @returns {objcet}
 */
Tools.getItem = function (spread, ns, year, treeCellNodeType) {
	var sheet = spread.getActiveSheet();
	var h = ns.SheetArea.colHeader;

	sheet.rowOutlines.ungroup();
	sheet.suspendPaint();
	sheet.suspendEvent();
	sheet.rowOutlines.direction(GC.Spread.Sheets.Outlines.OutlineDirection.backward);
	sheet.getRange(-1, 0, -1, 1).cellType(treeCellNodeType);

	var titleStyle = new GC.Spread.Sheets.Style();
	titleStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.center;
	titleStyle.font = "bold";

	sheet.setValue(0, 0, '预算科目');
	sheet.setStyle(0, 0, titleStyle);

	var dataSource;
	$.ajax({
		async: false,
		url: Tools.getRootPath() + '/item/all_by_year_code?year=' + year
	}).done(function (result) {
		dataSource = result;
		try {
			var i = 0;
			dataSource.forEach(function (iterable_element, i, arr) {
				i++;
				sheet.setValue(i, 0, iterable_element.name);
				if (iterable_element.statisticsCount > 0) {
					sheet.rowOutlines.group(i + 1, iterable_element.statisticsCount);
				}
			});
			sheet.getRange(-1, 0, -1, 1).width(300);
			sheet.showRowOutline(false);
			sheet.addSpan(1, 0, 2, 1, h); // row, col, rowCount, colCount, sheetArea
			sheet.addSpan(0, 1, 2, 1, h);
			sheet.resumeEvent();
			sheet.resumePaint(false);
		} catch (ex) {
			MessageBox.show("请刷新页面之后加载!");
			//console.log(ex);
		}
	}).fail(function (result) {
		MessageBox.show("数据请求失败!", "提示");
	});

	return sheet;
};

/**
 * 上传Spread.Sheets模板
 * @param {object} spread - GC.Spread.Sheets.findControl(document.getElementById('ss'))
 * @param {number} templateId - 模板id
 * @param {string} templateName - 模板名称
 * @param {string} fileType - 模板template、模板实例instance
 */
Tools.uploadTemplateFile = function (spread, templateId, templateName, fileType) {
	if (this.isNullOrEmpty(spread)) {
		return;
	}
	var excelIo = new GC.Spread.Excel.IO();
	if (typeof templateId === 'undefined' || templateId.length <= 0) {
		MessageBox.show("获取模板名称失败，请重试!");
		return;
	}
	var password = "";
	if (templateName.substr(-5, 5) !== '.json') {
		templateName += '.json';
	}
	//json数据
	var json = '';
	try {
		json = JSON.stringify(spread.toJSON({ includeBindingSource: true }));
	} catch (ex) {
		json = '';
	}
	if (json === '') {
		MessageBox.show("转换数据失败，请重试!");
		return;
	}
	localStorage.setItem(templateName, json); //缓存workbook
	excelIo.save(json, function (blob) {
		//excel数据
		var fd = new FormData();
		fd.append('file', blob); //excel
		fd.append('content', json); //ssjson
		fd.append('templateId', parseInt(templateId));
		fd.append('txtFileName', templateName);
		fd.append('fileType', fileType);
		$.ajax({
			method: "POST",
			url: Tools.getRootPath() + '/sys_file/upload_txt_and_excel', //'/sys_file/upload_json',
			data: fd,
			async: false,
			processData: false,
			contentType: false
		}).done(function (result) {
			if (result.isSuccess) {
				// TODO: 服务器处理上传文件是异步的，返回操作成功并不是100%的上传成功
				MessageBox.show("操作完成");
			} else {
				MessageBox.show("保存失败，请重试!");
			}
		}).fail(function (e) {
			//console.log(e);
			MessageBox.show("请求失败，请重试!");
		});
	});
};
/**
 * 实例化模板,替换取数页标签
 * '=SYPICKDATA('ETS数据源','ETS的数据集','test','预算年度')
 * @param {object} sp - spread
 * @param {object} dataObj - 变量参数 {budget_year:2017,budget_last_year:2016,budget_unit:xx,operator:admin}
 */
Tools.instancePickData = function (dataObj) {
	var spread = GC.Spread.Sheets.findControl(document.getElementById('ss'));
	var sheetCount = spread.getSheetCount();
	//获取所有的含有"取数页"页签
	for (var i = 0; i < sheetCount; i++) {
		var sheet = spread.getSheet(i);
		var name = sheet.name();
		if (name.indexOf('取数页') >= 0) {

			//获取A1单元格,查找含SYPICKDATA的单元格	
			var A0 = sheet.getCell(0, 0).text();
			var datasourceName;
			var datasetName;
			var condition;
			var paramValue = '';
			try {
				//解析出对应的数据集,查询组合条件	
				A0 = A0.substring(13, A0.lastIndexOf(')'));
				var param = A0.split(',');
				if (!param || param.length < 3) {
					throw new Error('错误的取数规则');
				}
				for (var j = 0; j < param.length; j++) {
					var tmpParam = $.trim(param[j]);
					tmpParam = tmpParam.substring(1, tmpParam.lastIndexOf("'"));
					if (j == 0) {
						//第一个参数: 数据源
						datasourceName = tmpParam;
						//console.log('datasourceName-->' + tmpParam);
					} else if (j == 1) {
						//第二个参数: 数据集
						datasetName = tmpParam;
						//console.log('datasetName-->' + tmpParam);
					} else if (j == 2) {
						//第三个参数: 组合条件名称
						condition = tmpParam;
						//console.log('condition-->' + tmpParam);
					} else {
						//参数变量
						//console.log(param[j]);
						if (!dataObj) return;
						if (tmpParam == '预算年度' && dataObj.hasOwnProperty('budget_year')) {
							paramValue += 'budget_year=' + dataObj.budget_year + '|';
						} else if (tmpParam == '上一年度' && dataObj.hasOwnProperty('budget_last_year')) {
							paramValue += 'budget_last_year=' + dataObj.budget_last_year + '|';
						} else if (tmpParam == '预算单元' && dataObj.hasOwnProperty('budget_unit')) {
							paramValue += 'budget_unit=' + dataObj.budget_unit + '|';
						} else if (tmpParam == '操作员' && dataObj.hasOwnProperty('operator')) {
							paramValue += 'operator=' + dataObj.operator + '|';
						} else if (tmpParam == '静态值' && dataObj.hasOwnProperty('static_value')) {
							paramValue += 'static_value' + dataObj.static_value + '|';
						}
					}
				}
				paramValue = paramValue.substring(0, paramValue.length - 1);
			} catch (ex) {}
			//根据数据源名称，数据集名称获取相应的id
			var datasourceId = Tools._getDataSourceId(datasourceName);
			var datasetId = Tools._getDataSetId(datasetName);

			var reqResult, reqMsg, dataSource;
			//取数
			//------------------------------------------------------------
			var url = Tools.getRootPath() + '/dataset/pick_data?datasourceId=' + datasourceId + '&datasetId=' + datasetId + '&conditionName=' + condition + '&paramValue=' + paramValue;
			$.ajax({
				async: false,
				type: 'GET',
				url: url
			}).done(function (result) {
				reqResult = result.isSuccess;
				reqMsg = result.message;
				dataSource = result.data;
			}).fail(function (result) {
				//console.log(result);
			});

			if (!reqResult) {
				return; //错误
			}

			//将取数填充到表格
			//-------------------------------------------------------------
			try {
				dataSource = JSON.parse($.trim(dataSource));
			} catch (ex) {
				alert("Json数据转换失败");
				return;
			}
			var spreadNS = GC.Spread.Sheets;
			//暂停绘制表格
			spread.suspendPaint();
			sheet.getRange(-1, 0, 0, 24).width(120);
			//给spread 填充数据
			var table = sheet.tables.addFromDataSource("Table1", 0, 0, dataSource, spreadNS.Tables.TableThemes.light9);
			//不显示汇总列数据
			table.showFooter(false);
			//不显示头部列数据
			table.showHeader(true);
			//加载首列
			table.highlightFirstColumn(true);
			//不加载最后一行
			table.highlightLastColumn(true);
			//重新绘制表格
			spread.resumePaint();
		}
	}
};
/**
 * 根据数据源的名称找到对应的id 
 */
Tools._getDataSourceId = function (name) {
	var id;
	var url = Tools.getRootPath() + '/datasource/search';
	$.ajax({
		url: url,
		type: 'POST',
		async: false,
		data: 'name=' + name
	}).done(function (result) {
		if (result.isSuccess) {
			id = result.data.id;
		}
	}).fail(function () {
		id = -1;
	});
	return id;
};
/**
 * 根据数据集的名称找到对应的id
 */
Tools._getDataSetId = function (name) {
	var id;
	var url = Tools.getRootPath() + '/dataset/search';
	$.ajax({
		url: url,
		type: 'POST',
		async: false,
		data: 'name=' + name
	}).done(function (result) {
		if (result.isSuccess) {
			id = result.data.id;
		}
	}).fail(function (res) {
		id = -1;
	});
	return id;
};

/**
 * 打开新的窗口
 * @param {string} url 
 * @param {number} width
 * @param {number} height
 * @param {string} name
 */
Tools.openWindow = function (url, width, height, name) {
	var left = (screen.width - width) / 2;
	var top = (screen.height - height) / 2;
	var newWin = window.open(url, name, "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height);
	newWin.focus();
	return newWin;
};

var globalLog = [];
/**
 * Sheet日志功能
 * 说明：
 * 		目前只记录单元格值、公式的改变，其它的改变暂时没有相关事件捕获
 * @param {object} spread - GC.Spread.Sheets.findControl(document.getElementById('ss'))
 */
Tools.recordModifySheetsLog = function (spread) {
	if (Tools.isNullOrEmpty(spread)) return;
	globalLog.length = 0;
	var oldValue = '',
	    newValue = '',
	    oldFormula = '',
	    newFormula = '';
	spread.bind(GC.Spread.Sheets.Events.CellClick, function (e, args) {
		var sheet = args.sheet,
		    row = args.row,
		    col = args.col;
		oldValue = sheet.getValue(row, col) || '';
		oldFormula = sheet.getFormula(row, col) || '';
		//alert('EnterCell:' + sheet.name() + row + col + oldValue);
	});
	spread.bind(GC.Spread.Sheets.Events.EditEnded, function (e, args) {
		var sheet = args.sheet,
		    row = args.row,
		    col = args.col;
		newValue = sheet.getValue(row, col) || '';
		newFormula = sheet.getFormula(row, col) || '';
		var serial = sheet.getValue(0, col, GC.Spread.Sheets.SheetArea.colHeader) + sheet.getValue(row, 0, GC.Spread.Sheets.SheetArea.rowHeader);
		if ($.trim(oldValue) !== $.trim(newValue)) {
			globalLog.push('表:' + sheet.name() + ',' + serial + ',值:' + oldValue + ',改:' + newValue + '|');
		} else {
			//不是值改变，则判断公式是否修改
			if ($.trim(oldFormula) !== $.trim(newFormula)) {
				globalLog.push('表:' + sheet.name() + ',' + serial + ',公式:' + oldFormula + ',改:' + newFormula + '|');
			}
		}
	});
};

/**
 * 时间戳转日期字符串
 * @param {string} str - 时间戳
 * @returns {string}
 */
Tools.tsToLong = function (str) {
	try {
		var d = new Date(parseInt(str));
		var month = d.getMonth() + 1;
		if (month > 12) {
			month = 12 - month;
		}
		if (month.toString().length < 2) {
			month = '0' + month;
		}
		var day = d.getDate();
		if (day.toString().length < 2) {
			day = '0' + day;
		}
		return d.getFullYear() + '-' + month + '-' + day + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
	} catch (e) {
		return str;
	}
};
Tools.tsToShort = function (str) {
	try {
		var res = this.tsToLong(str);
		return res.substring(0, 10);
	} catch (e) {
		return str;
	}
};

/**
 * 控制数字输入框小数精度
 */
Tools.initNumberIpt = function ($dom, dot) {
	var ipt = $dom.find('input[type=number]');
	for (var i = 0; i < ipt.length; i++) {
		if (Tools.isNullOrEmpty($(ipt).val())) {
			$(ipt).val(0 + '.' + '0'.repeat(dot));
		}
		$(ipt).on({
			input: function input() {
				//toFixed()
				var v = $(this).val();
				try {
					if (v && v.indexOf('.') >= 0) {
						var tmpDot = v.substr(v.indexOf('.') + 1);
						if (tmpDot && tmpDot.length > dot) {
							var newV = v.substring(0, v.indexOf('.') + 1) + v.substring(v.indexOf('.') + 1, v.indexOf('.') + 1 + dot);
							$(this).val(newV);
						}
					}
				} catch (e) {}
			},
			blur: function blur() {
				var v = $(this).val();
				if (Tools.isNullOrEmpty(v)) {
					$(this).val(0 + '.' + '0'.repeat(dot));
				}
			}
		});
	}
};

Array.prototype.removeByValue = function (val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) {
			this.splice(i, 1);
			break;
		}
	}
};

Tools.request = function (paras) {
	var url = location.href;
	var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
	var paraObj = {};
	for (i = 0; j = paraString[i]; i++) {
		paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
	}
	var returnValue = paraObj[paras.toLowerCase()];
	if (typeof returnValue == "undefined") {
		return "";
	} else {
		return returnValue;
	}
};
