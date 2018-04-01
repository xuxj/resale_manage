(function (window) {

    var rootPath = getRootPath();

    function getRootPath() {
        var pathName = window.location.pathname.substring(1);
        var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
        return window.location.protocol + '//' + window.location.host;
        
    }

    function importCss(fileName) {
        document.write('<link href="' + rootPath + fileName + '" type="text/css" rel="stylesheet" />');
    }

    importCss("/css/bootstrap.min.css");
    importCss("/css/plugins/dataTables/dataTables.bootstrap.css");
    importCss("/css/font-awesome.min93e3.css");
    importCss("/css/style.min.css");
    importCss("/css/plugins/jsTree/style.min.css");
    importCss("/css/plugins/treeTable/themes/vsStyle/treeTable.min.css");
    importCss("/js/syswinplugins/searchtree/src/stylesheets/hplus.zTree.min.css");
    importCss("/js/syswinplugins/searchtree/src/stylesheets/syswin.ui.searchtree.css");
    importCss("/js/plugins/zTree_v3-master/css/zTreeStyle/zTreeStyle.css");
    importCss("/css/index.css");
})(window);
