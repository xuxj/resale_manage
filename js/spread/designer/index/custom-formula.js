/**
 * 说明：
 * 1、添加公式先按照../公式添加简要.txt，在函数弹出框注册；
 * 2、公式还要在使用的时候进行全局js注册；
 */

window.SyswinVal = {
	getEditFormula: function getEditFormula(spread) {
		return null;
	},
	isValidFormula: function isValidFormula(sheet, formula) {
		return true;
	},
	clearFormula: function clearFormula(spread) {},
	clearTplCache: function clearTplCache() {
		return true;
	}
};

//获取单元格中的公式
window.SyswinVal.getEditFormula = function (spread) {
	var tmpSpread;
	var formula;
	if (Tools.isNullOrEmpty(spread)) {
		tmpSpread = GC.Spread.Sheets.findControl(document.getElementById('ss'));
	} else {
		tmpSpread = spread;
	}
	if (!Tools.isNullOrEmpty(tmpSpread)) {
		var sheet = tmpSpread.getActiveSheet();
		formula = sheet.getFormula(sheet.getActiveRowIndex(), sheet.getActiveColumnIndex());
	}
	return formula;
};

//是否合法公式
window.SyswinVal.isValidFormula = function (sheet, formula) {
	try {
		var parser = new GC.Spread.CalcEngine.CalcError.parse(formula);
	} catch (ex) {
		return false;
	}
	return true;
};

window.SyswinVal.clearTplCache = function () {
	return true;
};
window.SyswinVal.getTplObjCache = function (tpl_name) {
	if (Tools.isNullOrEmpty(tpl_name)) return '';
	var tpl_str = '';
	var tpl_obj;
	try {
		tpl_str = localStorage.getItem(tpl_name);
	} catch (ex) {}
	if (Tools.isNullOrEmpty(tpl_str)) return '';
	try {
		//模板json对象
		tpl_obj = JSON.parse($.trim(tpl_str));
	} catch (ex) {
		throw new Error('实例化模板失败: ' + file_name);
	}
	return tpl_obj;
};

//清除页面所有公式
window.SyswinVal.clearFormula = function (spread) {
	if (Tools.isNullOrEmpty(spread)) {
		return;
	}
	var sheetCount = spread.getSheetCount();
	for (var i = 0; i < sheetCount; i++) {
		var sheet = spread.getSheet(i);
		var sheetRowCount = sheet.getRowCount();
		var sheetColCount = sheet.getColumnCount();
		for (var x = 0; x < sheetRowCount; x++) {
			for (var y = 0; y < sheetColCount; y++) {
				if (!Tools.isNullOrEmpty(sheet.getFormula(x, y))) {
					var cellVal = sheet.getValue(x, y, GC.Spread.Sheets.SheetArea.viewport);
					sheet.setFormula(x, y, '');
					sheet.setValue(x, y, cellVal);
				}
			}
		}
	}
};

//js注册全局函数
var SYSUM = function SYSUM() {};
SYSUM.prototype = new GC.Spread.CalcEngine.Functions.AsyncFunction("SYSUM", 2, 2, { name: 'SYSUM', description: '返回模板单元格的合计值。' });
SYSUM.prototype.defaultValue = function () {
	return 'Loading...';
};
SYSUM.prototype.evaluateAsync = function (context) {
	//汇总页面
	var spread = GC.Spread.Sheets.findControl($('#ss')[0]);
	var value;
	var tpl;
	var tpl_obj;
	var sheets = spread.getSheetCount();
	//遍历Workbook所有的Sheet
	for (var i = 0; i < sheets; i++) {
		var sheet = spread.getSheet(i);
		//得到当前面签上下文对应的函数
		var formula = sheet.getFormula(context.row, context.col);
		if (!Tools.isNullOrEmpty(formula)) {
			//得到要远程获取模板的名称
			var file_name = sheet.name();
			//从缓存中获取模板
			tpl_obj = ''; //window.SyswinVal.getTplObjCache(file_name);
			//缓存中没有模板
			if (Tools.isNullOrEmpty(tpl_obj)) {
				//根据模板名称获取文件磁盘存储id
				var file_id = Tools.getTemplateFileId($.trim(file_name));
				if (!Tools.isNullOrEmpty(file_id)) {
					//获取模板ssjson
					tpl = Tools.getTemplate(file_id);
					try {
						//模板json对象
						tpl_obj = JSON.parse($.trim(tpl));
					} catch (ex) {
						throw new Error('实例化模板失败: ' + file_name);
					} /*
       try {
       localStorage.setItem(file_name, tpl);
       } catch (ex) {
       throw new Error('缓存模板失败：' + file_name);
       }*/
				}
			}
			if (!Tools.isNullOrEmpty(tpl_obj)) {
				//从ssjson实例化一个非host的Workbook对象
				var spread0 = new GC.Spread.Sheets.Workbook();
				spread0.fromJSON(tpl_obj);
				var sheet0 = spread0.getSheet(0); //??只支持引入Workbook的第一个页面  
				try {
					//将自定义函数替换为内置函数
					formula = formula.replace('SYSUM', 'SUM');
					//计算引擎等到值
					value = GC.Spread.Sheets.CalcEngine.evaluateFormula(sheet0, formula, 0, 0, false);
				} catch (o) {
					value = '#VALUE!';
				}
				//为当前上下文的单元格赋值
				context.setAsyncResult(value);
				//刷新当前上下文对应的Sheet面签
				spread.repaint();
			}
		}
	}
};
GC.Spread.CalcEngine.Functions.AsyncFunctionEvaluateMode.onRecalculation;
var sysum = new SYSUM();
GC.Spread.CalcEngine.Functions.defineGlobalCustomFunction("SYSUM", sysum);
