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
    // 提交订单
    $("#submit-order-btn").on("tap",function(){
        $(".mixin-pops,.stockOut-list").addClass("selected");
    });
    // 发票需知
    $("#receipt-page-view header .moreText").on("tap",function(){
        $(".mixin-pops,.receipt-pops").addClass("selected");
    });
    $(".pops-confirm-btn,.mixin-pops").on("tap",function(){
        $(".mixin-pops,.mixin-pops>div").removeClass("selected");
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
    // 自提联系人
    $(".ziti-section,.ziti-add-section").on("click",function(){
        $(".input-pops,.ziti-input").addClass("selected").find("input").first().focus();
    });
    // 身份证
    $(".idCard_ref").on("click",function(){
        $(".input-pops,.idCard_input").addClass("selected").find("input").first().focus();
    });
    // 关闭
    $(".input-pops .left-area,.input-pops").on("tap",function(){
        $(".input-pops,.input-pops > div").removeClass("selected");
    });
    // 后退
    $(".header .back").on("tap",function(){
        $("#main-page-view").addClass("selected").siblings().removeClass("selected");
    });
    // 统一页面切换
    $(".link-page-view").on("tap",function(){
        var view = $(this).attr("name");
        $("#"+view).addClass("selected").siblings().removeClass("selected");
    });
    // 发票列表项选择
    $("#receipt-page-view .receipt-item").on("tap",function(){
        var dThis = $(this),
            cur = dThis.find(".select-mixin-item");
        if(!cur.hasClass("secoo_icon_xuanzhong_red")){
            cur.addClass("secoo_icon_xuanzhong_red").removeClass("secoo_icon_xuanzhong");
            dThis.siblings().find(".select-mixin-item").removeClass("secoo_icon_xuanzhong_red").addClass("secoo_icon_xuanzhong");
            $("#receipt-page-view .company-input").toggleClass("selected",dThis.next().hasClass("company-input"));
        }
    });

    $.ajax();
    // headers:{"appId":appId,"appKey":appKey,"Content-Type":"text/plain;charset=UTF-8"},
}
