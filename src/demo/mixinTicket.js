//顶部导航
require('styles/panel/panel.scss');

require('styles/tap_bars/tap.scss');
//按钮
require('styles/btn/btn.scss');
require('styles/demo/pay_main.scss');

(function(){
    // 优惠券列表选择
    $("#ticket-page-view .ticket-item").on("tap",function(){
        var dThis = $(this),
            cur = dThis.find(".select-mixin-item");
        if(!cur.hasClass("secoo_icon_xuanzhong_red")){
            cur.addClass("secoo_icon_xuanzhong_red").removeClass("secoo_icon_weixuan");
            $("#ticket-page-view .ticket-item").not(dThis).find(".select-mixin-item").removeClass("secoo_icon_xuanzhong_red").addClass("secoo_icon_weixuan");
        }
    });
    // 激活优惠券
    $("#ticket-page-view header .more").on("click",function(){
        $(".input-pops,.ticket-input").addClass("selected").find("input").first().focus();
    });
    // 关闭
    $(".input-pops .left-area,.input-pops").on("tap",function(){
        $(".input-pops,.input-pops > div").removeClass("selected");
    });
    // 禁止弹窗拖拽
    $(".mixin-pops,.input-pops").on("touchmove",function(e) {
        e = e || window.event;
        var ul = $(e.srcElement).closest("ul")
        if(ul.length && ul.children().length >= 3) return;
        e.stopPropagation();
        e.preventDefault();
    });
    $(".mixin-pops > div,.input-pops > div").on("tap",function(e) {
        e = e || window.event;
        e.stopPropagation();
        e.preventDefault();
    });
})();

