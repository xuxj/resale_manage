;
(function ($) {
    btnEdit = function btnEdit() {
        var $con = $('<div class="btn-edit-wrapper"></div>');
        var oldipt = this[0].outerHTML;
        var ipt = this[0].outerHTML;
        var ctl = [];
        var result = [];
        var type;
        var keys = [];
        var ipt_pos = { x: 0, y: 0 };
        this.destory = function () {
            $con.replaceWith(oldipt);
        };
        this.initControl = function (props) {
            type = $.trim(props.type) || '';
            if (type === 'singletree' || type === "checktree") {
                ctl.push('<span class="btn-edit-con">');
                if (props.btn_type.length == 0) {
                    if (props.btn_text.length > 1) {
                        ctl.push('<a class="btn-edit-text">' + props.btn_text + '</a>');
                    } else {
                        ctl.push('<a class="btn-edit-icon" href="javascript:;"></a>');
                    }
                } else {
                    ipt = $(ipt).addClass('btn-edit-btn')[0].outerHTML;
                }
                ctl.push($(ipt).addClass('btn-edit')[0].outerHTML);
                ctl.push('</span>');
                ctl.push('<div class="layout nodisplay"></div>');
                ctl.push('<div class="btn-edit-dialog nodisplay"><div class="btn-edit-dialog-title"><p></p><span>x</span></div>');
                ctl.push('<div class="btn-edit-dialog-con"></div>');
                ctl.push('<p class="btn-edit-dialog-prompt"></p>');
                ctl.push('<div class="btn-edit-dialog-cmd"><p class="comment"></p><a href="javascript:;" class="dlg-cancel">取消</a><a href="javascript:;" class="dlg-ok">确定</a></div>');
                ctl.push('</div>');
                $con.append(ctl.join(''));
                if (!props.border) {
                    $con.find('.btn-edit-con input').addClass('noborder');
                }
                if (props.readonly) {
                    $con.find('.btn-edit').attr('readonly', 'true').addClass('readonly');
                }
                if (props.prompt.length > 1) {
                    $con.find('.btn-edit-dialog-prompt').attr('style', 'height: 25px;overflow:hidden;').html(props.prompt || '');
                } else {
                    $con.find('.btn-edit-dialog-prompt').remove();
                    $con.find('.btn-edit-dialog').attr('style', 'height:530px');
                }
                $con.find('.btn-edit-dialog-cmd .comment').html(props.comment || '');
                $dlg = $con.find('.btn-edit-dialog');
                $dlg.attr("style", 'top:' + props.dialog_top + ';left:' + props.dialog_left);
                if (props.right_cart) {
                    $con.find('.btn-edit-dialog').attr("style", $dlg.attr("style") + ";width: 700px;height:450px;");
                    var tmp = $con.find('.btn-edit-dialog-con');
                    if (props.prompt.length > 1) {
                        tmp.attr("style", "clear:both;overflow:hidden;height:310px");
                    } else {
                        tmp.attr("style", "clear:both;overflow:hidden;height:340px");
                    }
                    tmp.append("<ul class='btn-dialog-title'><li>" + (props.left_title || '') + "</li><li>" + (props.right_cart_title || '') + "</li></ul>");
                    tmp.append("<div class='btn-edit-left-dialog'></div><ul class='btn-edit-right-dialog'></ul>");
                }
                if (props.left_search) {}
                $con.find('.btn-edit-dialog-title>p').html(props.title || '');
                if ($con.find('.btn-edit')[0].hasAttribute('key')) {
                    keys = $con.find('.btn-edit').attr("key").split(',');
                    //console.log(keys);
                }
            } else if (type === 'grid') {
                $.each(props.columns, function (k, v) {
                    //console.log(k + ':' + v.title + ' ' + v.name);
                });
            }

            var has_label = props.label.title || '';
            if (has_label.length > 0) {
                var btn_name = $con.find('.btn-edit').attr('name') || '';
                var label = $('<label for="' + btn_name + '" style="' + (props.label.style || '') + '">' + (props.label.title || '') + '</lable>');
                if (props.label.require) {
                    label.append('<span class="require">*</span>');
                }
                $con.prepend(label[0]);
            }

            $(this).replaceWith($con);

            var clicked = "Nope.";
            var mausx = "0";
            var mausy = "0";
            var winx = "0";
            var winy = "0";
            var difx = mausx - winx;
            var dify = mausy - winy + 50;

            $('html').mousemove(function (event) {
                mausx = event.pageX;
                mausy = event.pageY;
                winx = $con.offset().left;
                winy = $con.offset().top;
                if (clicked == "Yeah.") {
                    var newx = event.pageX - difx - $con.css("marginLeft").replace('px', '');
                    var newy = event.pageY - dify - $con.css("marginTop").replace('px', '');
                    $con.find('.btn-edit-dialog').css({ top: newy, left: newx });
                }
            });

            $(".btn-edit-dialog-title").mousedown(function (event) {
                clicked = "Yeah.";
            });

            $("html").mouseup(function (event) {
                clicked = "Nope.";
            });

            $con.find('.btn-edit-icon, .btn-edit-text, .btn-edit-btn').bind('click', function () {
                $con.find('.layout, .btn-edit-dialog').removeClass('nodisplay');
            });
            $con.find('.dlg-cancel, .btn-edit-dialog-title>span').on('click', function () {
                $con.find('.layout, .btn-edit-dialog').addClass('nodisplay');
            });
            $con.find('.dlg-ok').on('click', function () {
                if (!props.afterCallback.call(this, result)) {
                    return;
                }
                $con.find('.layout, .btn-edit-dialog').addClass('nodisplay');
                if ($(this).attr('class') === 'dlg-ok' && typeof props.callback === 'function') {
                    if (result.length <= 0) {
                        return;
                    }
                    if (type === 'singletree') {
                        $con.find('.btn-edit').attr("key", result[0].key);
                        $con.find('.btn-edit').val(result[0].value);
                    } else if (type === 'checktree') {
                        var k = '',
                            v = '';
                        for (var i = 0; i < result.length; i++) {
                            k += result[i].key + ',';
                            v += result[i].value + ',';
                        }
                        $con.find('.btn-edit').attr("key", k.substr(0, k.length - 1));
                        $con.find('.btn-edit').val(v.substr(0, v.length - 1));
                    }
                    props.callback.call(this, result);
                }
            });

            $('.btn-edit-dialog .btn-edit-dialog-title').on("mousedown", function (e) {
                $(document).onselectstart = function (e) {
                    return false;
                };
                $(this)[0].onselectstart = function (e) {
                    return false;
                };
                $(this)[0].oncontextmenu = function (e) {
                    return false;
                };
                $(document).on("mousemove", function (e) {
                    var getEndX = e.clientX,
                        getEndY = e.clientY; /*
                                             $('.btn-edit-dialog').css({
                                             left: getEndX - 250,
                                             top: getEndY - 300
                                             });*/
                }).on("mouseup", function () {
                    $(document).unbind("mousemove");
                });
            });

            if (typeof this.props.initComplete === 'function') {
                this.props.initComplete.call(this);
            }
        };
        this.loadData = function (props) {
            $.ajax({
                url: props.url,
                type: props.method,
                data: props.data,
                statusCode: {
                    404: function _() {},
                    500: function _() {
                        //console.log('请求失败，请重新刷新页面');
                    }
                },
                error: function error(data) {},
                success: function success(data) {
                    if (typeof data === 'string') {
                        data = JSON.parse(data) || {};
                    }

                    var tree_class = props.right_cart ? '.btn-edit-left-dialog' : '.btn-edit-dialog-con';
                    if (type === 'singletree') {
                        $con.find(tree_class).jstree({
                            'core': {
                                'data': data
                            }
                        }).on('changed.jstree', function (e, data) {
                            result = [];
                            if (props.right_cart) {
                                $con.find('.btn-edit-right-dialog').html("");
                            }
                            var node = data.node;
                            //console.log(data.node.id + '-->' + data.node.text);
                            var level;
                            if (typeof node.a_attr !== 'undefined' && typeof node.a_attr.level !== 'undefined') {
                                level = node.a_attr.level;
                            }
                            result.push({ key: node.id, value: node.text, a_attr: node.a_attr, level: level || -1, child_key: '', child_value: '', child_level: -1 });
                            if (props.right_cart) {
                                var node_icon = props.right_cart_item_icon || '';
                                if (node_icon.length < 1) {
                                    node_icon = node.icon === 'none' ? '' : node.icon;
                                }
                                $.ajax({
                                    url: props.right_cart_url + "&parentId=" + node.id,
                                    type: props.method,
                                    dataType: 'json',
                                    success: function success(d) {
                                        $.each(d, function (i, item) {
                                            var $a = $("<a href='javascript:;'><span style='background: url(" + node_icon + ")'></span>" + item.text + "</a>");
                                            var $li = $("<li key='" + item.id + "'></li>");
                                            $li.append($a);
                                            $con.find('.btn-edit-right-dialog').append($li);
                                            $a.on('click', function () {
                                                result[0].child_key = item.id;
                                                result[0].child_value = item.text;
                                                result[0].child_level = item.level || -1;
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    } else if (type === 'checktree') {
                        var tree = $con.find(tree_class).jstree({
                            "core": {
                                "data": data
                            },
                            "checkbox": {
                                "keep_selected_style": false
                            },
                            "plugins": ["wholerow", "checkbox", "types", "themes"]
                        });
                        tree.on('changed.jstree', function (e, data) {
                            result = [];
                            if (props.right_cart) {
                                $con.find('.btn-edit-right-dialog').html("");
                            }
                            for (var i = 0; i < data.selected.length; i++) {
                                var node = data.instance.get_node(data.selected[i]);
                                var node_level = -1;
                                if (typeof node.a_attr !== 'undefined' || typeof node.a_attr.level !== 'undefined') {
                                    node_level = node.a_attr.level || '';
                                }
                                if (data.instance.is_leaf(node)) {
                                    result.push({
                                        key: node.id,
                                        value: node.text,
                                        a_attr: node.a_attr,
                                        level: node_level
                                    });
                                    if (props.right_cart) {
                                        var node_icon = props.right_cart_item_icon || '';
                                        if (node_icon.length < 1) {
                                            node_icon = node.icon === 'none' ? '' : node.icon;
                                        }
                                        var has_level = true;
                                        for (var j = 0; j < props.not_add_item.length; j++) {
                                            if (node_level === props.not_add_item[j]) {
                                                has_level = false;
                                                break;
                                            }
                                        }
                                        if (has_level) {
                                            $con.find('.btn-edit-right-dialog').append("<li key='" + node.id + "'><a href='javascript:;'><span style='background: url(" + node_icon + ")'></span>" + node.text + "</a><span>x</span></li>").find('span').mousedown(function (e) {
                                                e.stopPropagation();
                                            }).unbind('click').on('click', function () {
                                                $.jstree.reference(tree).uncheck_node($(this).parent().attr('key'));
                                            });
                                        }
                                    }
                                }
                            }
                        });
                        tree.on('loaded.jstree', function (e, data) {
                            $.jstree.reference(tree).check_node(keys);
                        });
                    }
                }
            });
        };
    };
    $.fn.btnEdit = function (config) {
        this.v = '1.6.7';
        if (!$(this).length) {
            return this;
        }
        this.props = {
            type: 'singletree', /* 类型：singletree单选树、checktree多选树、grid(未实现) */
            title: '', /* 弹出框标题 */
            label: { /* 控件input标题label：title名称、style样式(有Bug慎用)、require显示红色*号 */
                title: '',
                style: '',
                require: false
            },
            readonly: false, /* input控件只读 */
            border: true, /* input控件边框 */
            left_title: '列表', /* 弹出框左边分栏标题 */
            btn_text: '', /* input默认控件图片按钮，设置此值将显示设置文字 */
            btn_type: '',
            dialog_left: 500, /* 弹出框left距离 */
            dialog_top: 200, /* 弹出框top距离 */
            right_cart_title: '已选择项', /* 弹出框右边分栏标题 */
            right_cart_item_icon: '', /* 设置右边列表项图标，右边栏图标默认和父节点(左边选中项)一样，如果父节点没有图标，右边栏项则用此值 */
            not_add_item: [], /* 排除的节点 */
            prompt: '', /* 树提示信息 */
            comment: '', /* 树提示信息，和prompt对比只有位置和样式区别 */
            url: '', /* jsTree数据源 */
            right_cart_url: '', /* jsTree右边级联查询数据源，会自动在url后增加parentId参数 */
            method: 'get', /* ajax请求类型 */
            data: {}, /* ajax请求参数 */
            columns: {}, /* grid列(未实现)*/
            initComplete: function initComplete() {}, /* 控件初始化完成回调 */
            callback: function callback() {}, /* 默认绑定到input key和value中的值不保正完全正确，所以最好在关闭弹出框后回调，获取jsTree数据data对象 */
            afterCallback: function afterCallback() {
                return true;
            }
        };
        this.props = $.extend({}, this.props, config);
        btnEdit.call(this);
        this.initControl(this.props);
        this.loadData(this.props);
        return this;
    };
})(jQuery);
