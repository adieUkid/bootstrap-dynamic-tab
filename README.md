# bootstrap-dynamic-tab

动态化的bootstrap tabs，支持动态加载、关闭、刷新等

![Example](https://github.com/adieUkid/bootstrap-dynamic-tab/blob/master/Example.png)

## 使用

### 引用顺序:
1. jQuery
2. bootstrap3
3. bootstrap.dynamic-tab.js

### HTML：

```HTML
<ul class="nav nav-tabs"></ul>
<div class="tab-content"></div>
```

### JS:

```Javascript
$(function(){
    $.fn.tab.addTab({
        url: '/page1.html'
    })
})
```

## 方法

1. 刷新当前页
```Javascript
$.fn.tab.refreshCurrent()
```

2. 关闭当前页
```Javascript
$.fn.tab.closeCurrent()
```

## 参数详解

```Javascript
$.fn.tab.addTab({
    containerId: 'container-id',            //容器Id，默认为"body"
    tabId: 'new-tab-id',                    //自定义tabId
    tabName: '新页面',                       //自定义tab名称
    url: '/page2.html',                     //tab页面加载地址
    closable: false,                        //是否显示"关闭"按钮
    callback: function(tabId, paneId, $pane){
        $pane.find('.name').text('默认')     //加载完毕的回调函数，用于初始化页面
    }
})
```