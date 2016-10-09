//顶部导航
require('styles/panel/panel.scss');

require('styles/tap_bars/tap.scss');
//按钮
require('styles/btn/btn.scss');
require('styles/demo/pay_main.scss');
loadJs.init({
    js: {
        "wap": [
            "http://mstatic.secooimg.com/js/android/zepto.min.js?t=20151120",
            "http://mstatic.secooimg.com/activityJS/wap_activity_min.js"
        ]
    },
    callback: function () {
        relReady();
    }
});
function relReady(){
    // 统一页面切换
    $(".link-page-view").on("tap",function(){
        var view = $(this).attr("name");
        $("#"+view).addClass("selected").siblings().removeClass("selected");
    });
}