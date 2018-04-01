var GC;
(function (GC) {
    (function (Spread) {
        (function (Sheets) {
            (function (designer) {
                (function (index) {
                    var needSuspend;

                    function updateLayout() {
                        $(".content").css('height', $(".content").children('.fill-spread-content').height());
                        $(".header").css("width", $(window).width() + "px");
                        if ($(".ribbon-bar").data("gcui-gcuiribbon")) {
                            $(".ribbon-bar").data("gcui-gcuiribbon").updateRibbonSize();
                        }
                        var spread = designer.wrapper.spread;
                        if (spread && spread.isPaintSuspended()) {
                            spread.resumePaint();
                            spread.refresh();
                            needSuspend = true;
                        }
                    }
                    var _windowResizeTimer = null;

                    function _doWindowResize() {
                        if (_windowResizeTimer) {
                            window.clearTimeout(_windowResizeTimer);
                        }
                        _windowResizeTimer = window.setTimeout(function () {
                            updateLayout();
                            _windowResizeTimer = null;
                            if (needSuspend) {
                                needSuspend = false;
                                window.setTimeout(function () {
                                    designer.wrapper.spread.suspendPaint();
                                }, 300);
                            }
                        }, 100); //now delay 100ms to resize designer
                    }
                    ;

                    $(document).ready(function () {
                        designer.loader.loadContent();
                        $(window).resize(_doWindowResize);
                        $(window).resize();

                        $("#verticalSplitter").draggable({
                            axis: "y",
                            containment: "parent",
                            scroll: false,
                            zIndex: 100,
                            stop: function stop(event, ui) {
                                var $this = $(this),
                                    top = $this.offset().top,
                                    offset = top - $(".header").height(),
                                    $content = $(".content .fill-spread-content");

                                // adjust size of related items
                                $("#formulaBarText").css({ height: 20 + offset }); // 20: original height of formulaBarText
                                $content.css({ top: top + 10 }); // 10: height of the space for verticalSplitter
                                $content.parent().css({ height: $content.height() });
                                designer.wrapper.spread.refresh();
                            }
                        });

                        function disableDragDrop(dataTransfer) {
                            if (dataTransfer) {
                                dataTransfer.effectAllowed = "none";
                                dataTransfer.dropEffect = "none";
                            }
                        }
                        window.addEventListener("dragenter", function (e) {
                            if (e.target.id != dropzoneId) {
                                e.preventDefault();
                                disableDragDrop(e.dataTransfer);
                            }
                        }, false);
                        window.addEventListener("dragover", function (e) {
                            e = e || event;
                            e.preventDefault();
                            disableDragDrop(e.dataTransfer);
                        }, false);
                        window.addEventListener("drop", function (e) {
                            e = e || event;
                            e.preventDefault();
                            disableDragDrop(e.dataTransfer);
                        }, false);
                    });

                    designer.loader.ready(function () {
                        //To Fix the designer resize performance issues.
                        $(window).unbind("resize.gcuiribbon");
                        $("#verticalSplitter").show();
                    });
                })(designer.index || (designer.index = {}));
                var index = designer.index;
            })(Sheets.designer || (Sheets.designer = {}));
            var designer = Sheets.designer;
        })(Spread.Sheets || (Spread.Sheets = {}));
        var Sheets = Spread.Sheets;
    })(GC.Spread || (GC.Spread = {}));
    var Spread = GC.Spread;
})(GC || (GC = {}));
