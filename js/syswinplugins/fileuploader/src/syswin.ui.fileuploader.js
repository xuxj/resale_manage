/**
 * @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map
 * @link https://developer.mozilla.org/zh-CN/docs/Using_files_from_web_applications
 *
 * 这里考虑页面有多个附件上传选择器
 */
(function ($) {
	var maxKb = 30 * 1024;
	var Tools = {};
	Tools.isNullOrEmpty = function (v) {
		if (typeof v === 'undefined' || v === null || v.length <= 0) return true;
		return false;
	};
	Tools.getRootPath = function () {
		var pathName = window.location.pathname.substring(1);
		var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
		if (webName == "") {
			return window.location.protocol + '//' + window.location.host;
		} else {
			return window.location.protocol + '//' + window.location.host + '/' + webName;
		}
	};
	$.fn.extend({
		/**
   * @param {function} call - 回调函数
   * @param {object} config - 配置参数
   * @param {function} complete - 初始化完成调用
   */
		initFileUploader: function initFileUploader(call, config, complete) {
			if (!this.selector) throw new Error('请设置控件id');
			var opts = $.extend({ readonly: false }, config);
			var ids = $(this.selector).data('ids');

			var dom = [];
			var $dom;
			var id = this.selector.substr(1);
			var map = new Map();

			var fileAttachement = "fileAttachement" + id;
			var fileListCon = "fileListCon" + id;
			var fileToolBar = "fileToolBar" + id;
			var attNumber = "attNumber" + id;
			var aupload = "aupload" + id;
			var sysfile = "sysfile" + id;
			$('#' + fileAttachement).remove();

			//构建附件列表框
			var $fileCtl = $('<input type="file" name="" id="' + id + '" data-ids="">');
			dom.push('<div id=' + fileAttachement + ' class="amountLength" >');
			if (config.hasOwnProperty('showAttNumber') && config.showAttNumber) {
				dom.push('	<h4>附件信息</h4>');
				dom.push('	<hr/>');
			}
			dom.push('	<div class="fileListCon" id=' + fileListCon + '>');
			dom.push('		<div id=' + fileToolBar + ' class="fileToolBar">');
			if (config.hasOwnProperty('showAttNumber') && config.showAttNumber) {
				dom.push('			附件单据&nbsp;<input class="attNumber" type="number" id=' + attNumber + ' name=' + attNumber + ' ' + (opts.readonly ? 'readonly' : '') + '/>&nbsp;张');
			}
			dom.push('			' + (opts.readonly ? '' : '<a href="javascript:;" class="aupload" id=' + aupload + '></a>'));
			dom.push('          <p></p>');
			dom.push('      </div>');
			dom.push('		<ul>');
			dom.push('		</ul>');
			dom.push('	</div>');
			dom.push('</div>');
			$dom = $(dom.join(''));
			if (!opts.readonly) {
				$dom.find("#" + aupload).append($fileCtl);
				$dom.find("#" + aupload).append('+添加附件');
			}
			$dom.replaceAll($(this.selector));

			//从服务器加载附件列表
			if (!Tools.isNullOrEmpty(ids)) {
				msg('加载附件中...');
				$.ajax({
					method: 'POST',
					url: Tools.getRootPath() + '/sys_file/get_by_ids',
					data: 'ids=' + ids
				}).done(function (res) {
					var data = res.data;
					if (res.isSuccess && data) {
						if (data.length <= 0) {
							msg('没有附件');
						} else {
							data.forEach(function (v, i, a) {
								map.set(v.id + '', v.name);
								var $li = $('<li><a href="javascript:;" data-type="' + v.categoryCode + '" id="' + v.id + '">' + v.name + '</a>' + (opts.readonly ? '' : '<span>x</span>') + '</li>');
								$dom.find("#" + fileListCon + ' ul').append($li);
								deleteFile($li, map);
								downloadFile($li);
							});
							clear();
							$("#" + attNumber).val(map.size);
							if (typeof complete === 'function') {
								complete();
							}
						}
					}
				}).fail(function () {
					msg('加载附件失败');
				});
			}

			var idx = 0;
			$fileCtl.change('input', function () {
				msg('正在上传文件...');
				//选择上传文件
				var file = this.files[0];
				if (!file) {
					clear();
					return;
				}
				var fileSize = Math.ceil(this.files[0].size / 1024);
				var fileName = file.name;
				if (fileSize > maxKb) {
					msg('单个附件不能超过30MB');
					return;
				}
				if (map.has(file.name)) {
					return;
				}
				var id = sysfile + idx++;
				map.set(id, file.name);
				var $li = $('<li><a href="#" data-type="' + file.type + '" id="' + id + '">' + fileName + '</a>(' + fileSize + 'KB)' + '<img src="' + Tools.getRootPath() + '/js/syswinplugins/fileuploader/src/images/new.png"/><span>x</span></li>');
				$dom.find("#" + fileListCon + ' ul').append($li);
				var fd = new FormData();
				fd.append('file', file);
				$.ajax({
					method: "POST",
					url: Tools.getRootPath() + '/sys_file/upload',
					data: fd,
					processData: false,
					contentType: false
				}).done(function (result) {
					if (result.isSuccess) {
						//修改客户端的file_id
						if (result.data) {
							map.delete(id);
							map.set(result.data.id + '', fileName);
							$li.find('a').prop('id', result.data.id);
						}
						//修改客户端data-ids
						var ids = $fileCtl.data('ids');
						if (Tools.isNullOrEmpty(ids)) {
							$fileCtl.data('ids', result.data.id);
						} else {
							$fileCtl.data('ids', ids + ',' + result.data.id);
						}
						//回调返回file_id
						if (call && typeof call === 'function' && result.data) {
							call(result.data.id);
						}
						$("#" + attNumber).val(map.size);
						clear();
					} else {
						msg("保存失败，请重试!" + result.message);
					}
				}).fail(function (e) {
					msg("请求失败，请重试!");
				});
				//删除
				deleteFile($li, map);
				//下载
				downloadFile($li);
			}); // end of $fileCtl.change(...

			function clear() {
				$("#" + fileToolBar + ' p').html('');
			}
			function msg(txt) {
				$("#" + fileToolBar + ' p').html(txt);
			}
			function downloadFile($li) {
				//下载
				$li.find('a').on('click', function () {
					var fileid = $(this).prop('id');
					var url = Tools.getRootPath() + '/sys_file/download?id=' + fileid;
					window.open(url);
				});
			}
			function deleteFile($li, map) {
				$li.find('span').on('click', function () {
					clear();
					//删除
					var $tmpLi = $(this).parent();
					var $tmpA = $tmpLi.find('a');
					var fileId = $tmpA.prop('id') + '';
					var fileName = $tmpA.html();
					if (map.has(fileId)) {
						$.ajax({
							type: 'POST',
							url: Tools.getRootPath() + '/sys_file/delete',
							data: 'ids=' + fileId
						}).done(function (res) {
							if (res.isSuccess) {
								map.delete(fileId);
								$tmpLi.remove();
								//修改客户端data-ids
								var ids = '';
								var _iteratorNormalCompletion = true;
								var _didIteratorError = false;
								var _iteratorError = undefined;

								try {
									for (var _iterator = map.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
										var key = _step.value;

										ids += key + ',';
									}
								} catch (err) {
									_didIteratorError = true;
									_iteratorError = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion && _iterator.return) {
											_iterator.return();
										}
									} finally {
										if (_didIteratorError) {
											throw _iteratorError;
										}
									}
								}

								ids = ids.substring(0, ids.length - 1);
								$fileCtl.data('ids', ids);
								clear();
							} else {
								msg('删除失败：' + res.message);
							}
						}).fail(function () {
							msg("请求失败，请重试!");
						});
					}
				});
			}
		} // end of initFileUploader...
	});
})(jQuery);
