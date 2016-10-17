//顶部导航
require('styles/panel/panel.scss');
//顶部导航
require('styles/tap_bars/tap.scss');
//按钮
require('styles/btn/btn.scss');
require('styles/demo/cashierDesk.scss');
var payment = {
    init: function () {
        var orderId = getQueryString('orderId'),
            order_amount = getQueryString('prodTotalPrice');
        var areaType = window.localStorage.getItem('order_' + orderId);
        var that = this;
        // 订单金额
        $(".cashier-zero").html("&yen;"+Number(order_amount).toFixed(2));
        if (window.localStorage.getItem('hasGoldProd_' + orderId) === 'true') {
            $('#paymethodSection [payname="onlinepay"]').hide();
        } else {
            $('#paymethodSection [payname="onlinepay"]').show();
        }

        this.areaType = areaType;

        //获取在线支付方式 接口
        this.setPayMethod(order_amount);

        $('#goPayBtn').on('click', function () {
            var payname = that.payname;
            if($(this).attr("isClick") == "true"){
                return ;
            }
            $(this).attr("isClick",true);
            switch (payname) {
                case 'alipay':
                    that.AliPayAction();
                    break;
                case 'weixinpay':
                    that.weiXinPayAction();
                    break;
                case 'onlinepay':
                    that.validateFirstSooPay_Pay_Type01();
                    break;
                case 'iouspay' :
                    that.IousPayAction(orderId,order_amount);
                    break;
                // case 'friendspay' :
                //     that.friendsPayAction(orderId,order_amount);
                //     break;
            }
        });
        // 修改支付方式
        $('#paymethodSection').on('click', '.paytype-item', function () {
            var $this = $(this);
            that.payname = $this.attr('payname');
            switch (that.payname) {
                case 'alipay':
                    window.localStorage.setItem("isalipay_" + orderId, "yes");
                    break;
                case 'weixinpay':
                    window.localStorage.setItem("isweixinpay_" + orderId, "yes");
                    break;
                case 'onlinepay' :
                    window.localStorage.setItem("isonlinepay_" + orderId, "yes");
                    break;
                case 'iouspay' :
                    window.localStorage.setItem("isiouspay_" + orderId, "yes");
                    break;
                // case 'friendspay' :
                //     window.localStorage.setItem("isfriendspay_" + orderId, "yes");
                //     break;
                default:
                    break;
            }
            var itemBtn = $this.children("span");
            if(itemBtn.hasClass("secoo_icon_weixuan")){
                itemBtn.removeClass("secoo_icon_weixuan").addClass("secoo_icon_xuanzhong");
                $this.siblings().find(".secoo_icon_xuanzhong").removeClass("secoo_icon_xuanzhong").addClass("secoo_icon_weixuan");
            }
        });

        $('#paymethodSection .paytype-item').trigger('click');

        if (~navigator.userAgent.indexOf('MicroMessenger')) {
            $('#paymethodSection .wx').show().trigger('click');
        } else {
            $('#paymethodSection .alipay').show();
        }
    },
    /**
     * 微信支付
     * @return {void}
     */
    weiXinPayAction: function () {
        $.ajax({
            type : "GET",
            dataType : "jsonp",
            url : "http://pay.secoo.com/b2c/weixin/wc/WCPayJs.jsp",
            data : "upk=" + getCookie('Sid') + "&orderid=" + getQueryString('orderId'),
            beforeSend : function() {
                $("#goPayBtn").text("正在提交...");
            },
            success : function(result) {
                $(this).attr("isClick",false);
                window.localStorage.setItem("weixinpay_data", JSON.stringify(result));
                window.location.href = 'weixin/weixinpay.html?showwxpaytitle=1&frompage=postordersuccess&orderid=' + getQueryString('orderId');
            },
            error : function() {
                $("#goPayBtn").text("去支付");
            }
        });
    },

    /**
     * 支付宝支付
     * @return {void}
     */
    AliPayAction: function () {
        $("#goPayBtn").text("正在提交...");
        $(this).attr("isClick",false);
        window.location.href = "http://pay.secoo.com/b2c/alipay/alipayWapPay.jsp?orderid=" + getQueryString('orderId') + "&upk=" + getCookie('Sid');
    },

    /**
     * 联动优势支付
     * @return {void}
     */
    validateFirstSooPay_Pay_Type01: function () {
        var that = this;

        $.ajax({
            type : "GET",
            dataType : "jsonp",
            url : "http://pay.secoo.com/b2c/ump/umpBinding.jsp",
            data : "upk="+getCookie('Sid')+"&pay_type=01",
            beforeSend : function() {
                $("#goPayBtn").text("正在提交...");
            },
            success : function(result_data) {
                $("#goPayBtn").text("去支付");
                $(this).attr("isClick",false);
                if(result_data.retcode == -1){
                    that.validateFirstSooPay_Pay_Type02(false);
                }else{
                    var upk = getCookie("Sid");
                    var userId = upk.split("|")[1];
                    window.localStorage.setItem("liandongyoushibangdingtype01_" + userId, JSON.stringify(result_data));
                    that.validateFirstSooPay_Pay_Type02(true);
                }
            },
            error : function() {
                $("#goPayBtn").text("去支付");
            }
        });
    },
    validateFirstSooPay_Pay_Type02: function (hasPayType01) {
        var that = this;

        $.ajax({
            type : "GET",
            dataType : "jsonp",
            url : "http://pay.secoo.com/b2c/ump/umpBinding.jsp",
            data : "upk="+getCookie('Sid')+"&pay_type=02",
            beforeSend : function() {
                $("#goPayBtn").text("正在提交...");
            },
            success : function(result_data) {
                $("#goPayBtn").text("去支付");
                if(result_data.retcode == -1 && !hasPayType01){
                    that.jumpPageToPay();
                }else{
                    var upk = getCookie("Sid");
                    var userId = upk.split("|")[1];

                    window.localStorage.setItem("liandongyoushibangdingtype02_" + userId, JSON.stringify(result_data));
                    window.location.href = "soopay.html?orderid=" + getQueryString('orderId') + "&totalordermoney=" + getQueryString('prodTotalPrice');;
                }
            },
            error : function() {
                $("#goPayBtn").text("去支付");
            }
        });
    },
    jumpPageToPay: function () {
        $.ajax({
            type : "GET",
            dataType : "jsonp",
            url : "http://pay.secoo.com/b2c/ump/umpPay.jsp",
            data : "upk="+getCookie('Sid')+"&orderid=" + getQueryString('orderId'),
            beforeSend : function() {
                $("#posw_toPay").text("正在提交...");
            },
            success : function(result_data) {
                $("#posw_toPay").text("去支付");
                var tradeNo = result_data.tradeNo;
                var upk = getCookie('Sid');
                var userId = upk.split("|")[1];

                window.location.href = 'https://m.soopay.net/q/html5/index.do?tradeNo=' + tradeNo + '&retUrl=' + encodeURIComponent('http://m.secoo.com') + "&merCustId=" + userId;
            },
            error : function() {
                $("#posw_toPay").text("去支付");
            }
        });
    },
    //库支票支付
    IousPayAction : function(){
        var _t = this;
        _t.getIousUrl(function(result){
            $(this).attr("isClick",false);
            if(result.rp_result.recode == "0" && result.rp_result.status == "1"){
                var redirectUrl = result.rp_result.redirectUrl;
                redirectUrl = redirectUrl.indexOf("?") > -1 ? redirectUrl+"&pagename=paysucess&from=h5" : redirectUrl+"?pagename=paysucess&from=h5";
                //白条支付 跳转链接
                window.location.href = redirectUrl;
            }else{
                alert(result.rp_result.errMsg);
            }
        });
    },

    //微信好友代付
    friendsPayAction : function(orderId,order_amount){
        var orderImg = window.localStorage.getItem("orderImg");
        setCookie("Sid",getCookie("Sid"),"secoo.com","");
        $("#goPayBtn").text("正在提交...");
        $(this).attr("isClick",false);
        window.location.href = "http://m.secoo.com/appActivity/weixinPayment.shtml?order_amount="+order_amount+"&orderId="+orderId+"&orderImg="+orderImg;
    },
    //库白条支付
    getIousUrl : function(callback){
        var upk = getCookie("Sid"), param = {'vo.upkey':upk,'orderId':getQueryString('orderId')},
            urlS = "http://m.secoo.com/mobileservice/baitiao?v=1.0&client=iphone&method=baiTiaoPay";
        $.ajax({
            type : "GET",
            dataType : "jsonp",
            url : urlS,
            data : param,
            beforeSend : function(){
                $("#goPayBtn").text("正在提交...");
            },
            success : function(result) {
                $("#goPayBtn").text("去支付");
                callback && callback(result);
            },
            error : function() {
                alert("网络异常，稍后再试!");
                $("#goPayBtn").text("去支付");
            }
        });
    },
    /**
     * 获取在线支付方式
     * @param  {Number} cardNo
     * @return {Object}
     */
    setPayMethod : function(order_amount){
        var urlS = "http://lr.secooimg.com/pay_ways",
            dataJson = {platform_type:3,upk:getCookie("Sid"),isSettlement : 0,order_amount : order_amount},
            payObj = {"1":"alipay","2" : "weixinpay", "3":"onlinepay","4":"iouspay","5":"applepay","6":"friendspay","10":"secoopay"};
        $.ajax({
            type : "GET",
            dataType : "jsonp",
            url : urlS,
            data : dataJson,
            success : function(result) {
                if(result.rp_result.recode == 0){
                    var payWays = result.rp_result.payWays, html = "";
                    for(var i = 0, len = payWays.length; i < len; i++){
                        var btnClass = payWays[i].isDefault?"secoo_icon_weixuan":"secoo_icon_xuanzhong";
                        switch(payWays[i].id){
                            case "1": // 支付宝支付
                                html += ['<div class="paytype-item cell clell_border" payname="'+payObj[payWays[i].id]+'">',
                                    '<p class="in_pr zhb-icon"></p>',
                                    '<div class="cashier-first">',
                                    '<div class="bold">支付宝支付</div>',
                                    '<span>'+payWays[i].payName+'</span>',
                                    '</div>',
                                    '<span class="'+btnClass+'">',
                                    '<span class="path1"></span>',
                                    '<span class="path2"></span>',
                                    '</span>',
                                    '</div>'].join("");
                                break;
                            case "2": // 微信支付
                                html += ['<div class="paytype-item cell clell_border" payname="'+payObj[payWays[i].id]+'">',
                                    '<p class="in_pr"></p>',
                                    '<div class="cashier-first">',
                                    '<div class="bold">微信支付</div>',
                                    '<span>'+payWays[i].payName+'</span>',
                                    '</div>',
                                    '<span class="'+btnClass+'">',
                                    '<span class="path1"></span>',
                                    '<span class="path2"></span>',
                                    '</span>',
                                    '</div>'].join("");
                                break;
                            case "3": // 手机银行支付
                                html += ['<div class="paytype-item cell clell_border" payname="'+payObj[payWays[i].id]+'">',
                                    '<p class="in_pr bank-icon"></p>',
                                    '<div class="bold">手机银行</div>',
                                    '<span class="'+btnClass+'">',
                                    '<span class="path1"></span>',
                                    '<span class="path2"></span>',
                                    '</span>',
                                    '</div>'].join("");
                                break;
                            case "4": // 库支票支付
                                if(payWays[i].enable == 1){
                                    html += ['<div class="paytype-item cell clell_border" payname="'+payObj[payWays[i].id]+'">',
                                        '<p class="in_pr cooTicket-icon"></p>',
                                        '<div class="cashier-second">',
                                        '<div class="bold">库支票</div>',
                                        '<span>'+payWays[i].payName+'</span>',
                                        '</div>',
                                        '<span class="'+btnClass+'">',
                                        '<span class="path1"></span>',
                                        '<span class="path2"></span>',
                                        '</span>',
                                        '</div>'].join("");
                                }else{
                                    html += ['<div class="paytype-item cell clell_border">',
                                        '<p class="in_pr dis-cooTicket-icon"></p>',
                                        '<div class="cashier-second cashier-third">',
                                        '<div class="bold">库支票</div>',
                                        '<span>'+payWays[i].payName+'</span>',
                                        '</div>',
                                        '<span class="secoo_icon_bukexuan">',
                                        '<span class="path1"></span>',
                                        '<span class="path2"></span>',
                                        '</span>',
                                        '</div>'].join("");
                                }
                                break;
                        }
                    }
                    $("#paymethodSection").append(html);
                    payment.payname = $("#paymethodSection .secoo_icon_xuanzhong").closest(".paytype-item").attr("payname");
                }else{
                    alert(result.rp_result.errMsg);
                }
            },
            error : function() {
                alert("网络异常，稍后再试!");
            }
        });
    }
};
$(function () {
    payment.init();

    // 订单剩余时间处理
    var orderId = getQueryString('orderId'),
        currentDate = new Date("<!--#echo var='DATE_LOCAL' -->"),
        endDate, orderTimer = JSON.parse(window.localStorage.getItem("orderTimer")) || {};
    if(orderTimer[orderId]){
        endDate = new Date(orderTimer[orderId]);
    }else{
        endDate = new Date(currentDate.getTime()+(60*60*1000));
        orderTimer[orderId] = currentDate.getTime()+(60*60*1000);
        window.localStorage.setItem("orderTimer",JSON.stringify(orderTimer));
    }
    if(orderId){
        // 去支付倒计时1小时
        new Countdown({
            selector: ".cashierDesk-timer > div",
            dateStart: currentDate,
            dateEnd: endDate,
            leadingZeros: true,
            msgBefore: $(".cashierDesk-timer > div").html(),
            msgAfter: "去支付",
            msgPattern: '{minutes}:{seconds}'
        });
        $(".cashierDesk-timer").children().show();
    }
    // 百度统计
    // var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
    // document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F0b244704c105fcdb4c38b56ba154d77b' type='text/javascript'%3E%3C/script%3E"));
    // $('#goPayBtn').on('click', function () {
    //     _hmt.push(['_trackEvent', 'payment', 'click', 'goPayAction']);
    // });
});
