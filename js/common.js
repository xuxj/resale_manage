/*
 * 网站根目录
 * 启动服务时候配置
 */
var rootPath = '';
var userInfo = {};
userInfo.name = "admin";
userInfo.id = "1";

/*
 * 网站根目录
 * 不启动服务时候配置,配置到webapp的路径
 */
//var rootPath = "file:///F:/project/workspace/nets-master/nets-budget/src/main/webapp";
//var rootPath = "file:///D:/work/SZ/ETS-NEW/code/trunk/nets-master/nets-budget/src/main/webapp";
//var rootPath = "file:///E:/grady/code/trunk/nets-master/nets-budget/src/main/webapp";
//var rootPath = "http://localhost:8091";

//网站根目录
function getRootPath() {
    var pathName = window.location.pathname.substring(1);
    console.log(pathName);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    if (webName == "") {
        return window.location.protocol + '//' + window.location.host;
    } else {
        return window.location.protocol + '//' + window.location.host + '/' + webName;
    }
}
//获取参数
function getQueryString(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}

function importJs(fileName) {
    document.write('<script src="' + rootPath + fileName + '" type="text/javascript"></script>');
}

function importCss(fileName) {
    document.write('<link href="' + rootPath + fileName + '" type="text/css" rel="stylesheet" />');
}

function importCss1(fileName){
	document.write('<link href="' + rootPath + fileName + '" type="text/css" media="print" rel="stylesheet" />');
}
importCss1("/css/window-print.css");

//importCss("/css/bootstrap.min.css");
//importCss("/css/plugins/dataTables/dataTables.bootstrap.css");
//importCss("/css/font-awesome.min93e3.css");
//importCss("/css/style.min.css");
//importCss("/css/plugins/jsTree/style.min.css");
//importCss("/css/plugins/treeTable/themes/vsStyle/treeTable.min.css");
//importCss("/js/syswinplugins/searchtree/src/stylesheets/hplus.zTree.min.css");
//importCss("/js/syswinplugins/searchtree/src/stylesheets/syswin.ui.searchtree.css");
//importCss("/js/plugins/zTree_v3-master/css/zTreeStyle/zTreeStyle.css");
//importCss("/css/index.css");

importJs("/js/plugins/jquery/jquery.min.js");
importJs("/js/ajaxUtil.js");
importJs("/js/treeUtil.js");
importJs("/js/plugins/angular/angular.min.js");
importJs("/js/plugins/bootstrap/bootstrap.min.js");
importJs("/js/plugins/metisMenu/jquery.metisMenu.js");
importJs("/js/plugins/slimscroll/jquery.slimscroll.min.js");
importJs("/js/plugins/layer-v3.0.1/layer.js");
importJs("/js/plugins/pace/pace.min.js");
importJs("/js/plugins/jsTree/jstree.min.js");
importJs("/js/syswinplugins/searchtree/src/syswin.ui.searchtree.js");
importJs("/js/hplus.min.js");
importJs("/js/contabs.min.js");
importJs("/js/plugins/treeTable/jquery.treeTable.min.js");
importJs("/js/plugins/artTemplate/template.js");
importJs("/js/plugins/laydate/laydate.js");
importJs("/js/plugins/zTree_v3-master/js/jquery.ztree.core.js");
importJs("/js/plugins/zTree_v3-master/js/jquery.ztree.excheck.js");
importJs("/js/commonData.js");
importJs("/js/login.js");

//关闭弹出窗口
function closeWindow() {
    parent.layer.close(parent.layer.getFrameIndex(window.name));
}

/**
 * 生成表格树
 * rootId : 根节点id
 * column : 第几列是树
 */
function treeTable(tableId, tbodyId, tplId, expandLevel, data, rootId, column) {
    if (!column) column = 0;
    treeTableAddRow("#" + tbodyId, tplId, data, rootId);
    $("#" + tableId).treeTable({ expandLevel: expandLevel, column: column });
}

function treeTableAddRow(list, tplId, data, pid) {
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (row.pid == pid) {
            $(list).append(template(tplId, { row: row }));
            treeTableAddRow(list, tplId, data, row.id);
        }
    }
}

/**
 * 搜索树节点接口
 * @param treeViewId
 * @param searchInputId
 * @param treeviewDropdownBtn
 * @returns
 */
function InitDropDownTreeSearch(treeViewId, searchInputId, treeviewDropdownBtn) {
    var tv = $(treeViewId).data('kendoTreeView');

    // Searching functionality with 'keyup' event of the input search box
    $(searchInputId).on('keyup', function () {
        $(treeViewId + ' li.k-item').show();

        $('span.k-in > span.highlight').each(function () {
            $(this).parent().text($(this).parent().text());
        });

        // ignore if no search term
        if ($.trim($(this).val()) === '') {
            tv.select() //gets currently selected <li> element
            .find("span.k-state-selected").removeClass("k-state-selected"); //removes the highlight class

            $('#lblselected').html("Selecting: --");
            return;
        }

        var term = this.value.toUpperCase();
        var tlen = term.length;

        $(treeViewId + ' span.k-in').each(function (index) {
            var text = $(this).text();
            var html = '';
            var q = 0;
            var p;

            while ((p = text.toUpperCase().indexOf(term, q)) >= 0) {
                html += text.substring(q, p) + '<span class="highlight">' + text.substr(p, tlen) + '</span>';
                q = p + tlen;
            }

            if (q > 0) {
                html += text.substring(q);
                $(this).html(html);

                $(this).parentsUntil('.k-treeview').filter('.k-item').each(function (index, element) {
                    tv.expand($(this));
                    $(this).data('SearchTerm', term);
                });
            }
        });

        $(treeViewId + ' li.k-item:not(:has(".highlight"))').hide();
    });

    $(searchInputId).on('blur', function () {
        if ($('#treeViewSearchInput').val() == '') {
            //$('#treeview').hide();             
        } else {
            $('#treeview').show();
        }
    });

    $(searchInputId).on('focus', function () {
        $('#treeview').show();$('#treeViewSearchInput').keyup();
    });

    $(treeviewDropdownBtn).on('click', function () {
        $('#treeview').toggle();
    });
}

//获取选择框值
function getCheckedVal(checkName) {
    var ids = [];
    $('input[name="' + checkName + '"]:checked').each(function () {
        ids.push($(this).val());
    });

    return ids.join(",");
}

//去前后空格
String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

function isNotNull(param) {
    if (param == undefined || param === "") {
        return false;
    }
    return true;
}

Math.formatFloat = function(f, digit) { 
    var m = Math.pow(10, digit); 
    return parseInt(f * m, 10) / m; 
} 

function doPrint(eleId,styleId)
{
	if(eleId==null||eleId==='')
	{
		window.print();
	}
	var oDiv2 = document.getElementById(eleId);  
	var oPop = window.open('','oPop');  
	console.log(oPop)
    var str = '<!DOCTYPE html>'  ;
        str +='<html>'  ;
        
        
        str +='<head>'  ;
        str+='<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'  ;
        str+='<meta name="viewport" content="width=device-width, initial-scale=1.0">'  ;
        
      
        
        //导入常用的样式
        str +=getCSS("/css/bootstrap.min.css");
        str +=getCSS("/css/window-print.css");
        str +=getCSS("/css/plugins/dataTables/dataTables.bootstrap.css");
        str +=getCSS("/css/font-awesome.min93e3.css");
        str +=getCSS("/css/style.min.css");
        str +=getCSS("/css/plugins/jsTree/style.min.css");
        str +=getCSS("/css/plugins/treeTable/themes/vsStyle/treeTable.min.css");
        str +=getCSS("/js/syswinplugins/searchtree/src/stylesheets/hplus.zTree.min.css");
        str += getCSS("/js/syswinplugins/searchtree/src/stylesheets/syswin.ui.searchtree.css");
        str +=getCSS("/js/plugins/zTree_v3-master/css/zTreeStyle/zTreeStyle.css");
        str +=getCSS("/css/index.css");
      
        str+='<style>';    
	    if(styleId!=null||styleId!='')   
	     {
	    	 var style = document.getElementById(styleId);   
	    	 str +=style.innerHTML;  
	     }
       
        str+='</style>'; 
        str +='</head>'  ;
        str +='<body>'  ;
        str +=oDiv2.innerHTML;  
        str +='</body>'  ;
        str +='</html>'  ;
        str+=' <script type="text/javascript">window.print();</script>';
        oPop.document.write(str);  
    console.log(str);
    //oPop.print();  
    //oPop.close();  
}

function getCSS(fileName)
{
	return ' <link href="' + rootPath + fileName + '" type="text/css" rel="stylesheet" />';
}
