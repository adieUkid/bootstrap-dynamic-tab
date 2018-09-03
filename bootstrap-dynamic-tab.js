/* ========================================================================
 * bootstrap-tab-dynamic.js v0.1
 * ======================================================================== */

if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

if (typeof $.fn.tab === 'undefined') {
    throw new Error('Bootstrap\'s dynamic tab requires bootstrap\'s tab.js')
}

+
function ($) {
    'use strict';

    var Plugin = $.fn.tab
    var Tab = $.fn.tab.Constructor

    var loadPane = function (url, tabId, paneId, callback) {
        if (url) {
            var $pane = $('#' + paneId)
            $.ajax({
                url: url,
                type: 'get',
                cache: false
            }).then(function (data) {
                $pane.html(data)
            }, function () {
                $pane.html('加载出错')
            }).always(function () {
                if (Object.prototype.toString.call(callback) == '[object Function]') {
                    callback(tabId, paneId, $pane)
                }
            })
        }
    }

    Plugin.addTab = function (opts) {
        var TAB_PREFIX = 'dynamic_tab_',
            PANE_PREFIX = 'dynamic_pane_',
            DEFAULT_TABNAME = 'New Tab'

        var opts = opts || {},
            container = opts.containerId || 'body',
            $container = $(opts.containerId ? '#' + container : 'body'),
            tabId = TAB_PREFIX + container + '_' + (opts.tabId || Date.now()),
            paneId = PANE_PREFIX + container + '_' + (opts.tabId || Date.now()),
            tabName = opts.tabName || DEFAULT_TABNAME,
            url = opts.url,
            closable = opts.closable,
            callback = opts.callback

        if (!$container.find('#' + tabId)[0]) {
            var li_tab = '<li id="' + tabId + '"><a href="#' + paneId + '" data-toggle="tab">' + tabName
            if (closable) {
                li_tab += '<span data-action="close" style="cursor: pointer;padding-left: 8px;font-size: 18px;vertical-align: middle;line-height: 0px;">&times;</span>'
            }
            li_tab += '</a></li>'

            var div_pane = '<div class="tab-pane fade" id="' + paneId + '">' + (url ? '正在加载...' : '') + '</div>';

            $container.find('.nav-tabs:first').append(li_tab)
            $container.find('.tab-content:first').append(div_pane)

            loadPane(url, tabId, paneId, callback)
        }

        var newOpts = Object.assign(opts, {
            tabId: tabId,
            paneId: paneId,
            tabName: tabName
        })
        $container.find('#' + tabId + '>a').data('opts', newOpts).click()
    }

    Plugin.refreshCurrent = function (containerId) {
        var $container = $(containerId ? '#' + containerId : 'body')
        $container.find('.nav-tabs:first li.active>a').tab('refresh')
    }

    Plugin.closeCurrent = function (containerId) {
        var $container = $(containerId ? '#' + containerId : 'body')
        $container.find('.nav-tabs:first li.active>a').tab('close')
    }

    Tab.prototype.close = function () {
        var _this = this
        if (confirm('确认关闭？')) { //可替换成其他插件
            close.call(_this)
        }

        function close() {
            var $this = this.element,
                $li = $this.closest('li'),
                opts = $this.data('opts'),
                $pane = $('#' + opts.paneId),
                hasSibling = !!$li.siblings()[0]

            if ($pane.hasClass('active') && $pane.hasClass('fade') && $.support.transition) {
                if (hasSibling) {
                    $pane.one('bsTransitionEnd', $pane.remove)
                } else {
                    $pane
                        .one('bsTransitionEnd', $pane.remove)
                        .emulateTransitionEnd(Tab.TRANSITION_DURATION)
                    $pane.removeClass('in')
                }
            } else {
                $pane.remove()
            }

            if ($li.hasClass('active') && hasSibling) {
                var $sibling = $li.next()[0] ? $li.next() : $li.prev()
                $sibling.find('a').tab('show')
            }
            $li.remove()
        }
    }

    Tab.prototype.refresh = function () {
        var $this = this.element
        var opts = $this.data('opts')
        loadPane(opts.url, opts.tabId, opts.paneId, opts.callback)
    }

    // TAB DATA-API
    // ============

    var closeHandler = function (e) {
        Plugin.call($(this).parent(), 'close')
        return false
    }

    $(document)
        .on('click.bs.tab.data-api', '[data-action="close"]', closeHandler)

}(jQuery);