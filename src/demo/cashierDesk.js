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
        this.setPayMethod(orderId);

        $('#goPayBtn').on('click', function () {
            var payname = that.payname,
                dThis = $(this);
            if(dThis.attr("isClick") == "true" || dThis.text() == "正在提交..."){
                return ;
            }
            dThis.attr("isClick",true);
            if($(this).attr("timeover") == 1){
                window.location.href = "http://m.secoo.com/appActivity/mOrderDetail.shtml?orderId="+orderId;
            }else{
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
                    case 'bankRemittance':
                        window.location.href = "http://m.secoo.com/appActivity/bankRemittance.shtml?pageid=1318&orderId="+orderId+"&price="+order_amount;
                        break;
                    // case 'friendspay' :
                    //     that.friendsPayAction(orderId,order_amount);
                    //     break;
                }
                setTimeout(function(){
                    dThis.attr("isClick",false);
                },5000);
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
                window.location.href = 'http://m.secoo.com/weixin/weixinpay.html?showwxpaytitle=1&frompage=postordersuccess&orderid=' + getQueryString('orderId');
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
        $("#goPayBtn").text("去支付");
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
                    window.location.href = "http://m.secoo.com/soopay.html?orderid=" + getQueryString('orderId') + "&totalordermoney=" + getQueryString('prodTotalPrice');;
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
    //判断是否微信
    isWeiXin : function(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    },
    /**
     * 获取在线支付方式
     * @param  {Number} orderId
     * @return {Object}
     */
    setPayMethod : function(orderId){
        var that = this,
            urlS = "http://las.secoo.com/api/cart/order_finish",
            dataJson = {c_channel:getCookie('channel'),c_platform_type:2,upk:getCookie("Sid"),size : 2,orderId : orderId,canApplePay:false,weixinSupport:that.isWeiXin()},
            payObj = {"2":"bankRemittance","4" : "weixinpay","5":"alipay","6":"onlinepay","7":"iouspay"};
        $.ajax({
            type : "GET",
            dataType : "jsonp",
            url : urlS,
            data : dataJson,
            success : function(result) {
                if(result.retCode == 0){
                    // 倒计时
                    var orderRemainingPayTimeNumber = Number(result.orderRemainingPayTime),
                        timer_ele = $(".cashierDesk-timer").children(),
                        mixinTimer  = setInterval(function(){
                            var time = "00:00";
                        if(orderRemainingPayTimeNumber <= 0){
                            clearInterval(mixinTimer);
                            $("#goPayBtn").attr("timeover",1);
                        }else{
                            var fTemp = parseInt(orderRemainingPayTimeNumber/60000),
                                sTemp = (orderRemainingPayTimeNumber%60000)/1000;
                            if(fTemp < 10){
                                fTemp = "0"+fTemp;
                            }
                            if(sTemp < 10){
                                sTemp = "0"+sTemp;
                            }
                            time = fTemp+":"+sTemp;
                            orderRemainingPayTimeNumber -= 1000;
                        }
                        $(".cashierDesk-timer > div").html(time);
                        timer_ele.show();
                    },1000);
                    var payWays = result.payWays, html = "";
                    for(var i = 0, len = payWays.length; i < len; i++){
                        if(payWays[i].enable == 0 && payWays[i].id != 7) continue;
                        var btnClass = payWays[i].isDefault?"secoo_icon_weixuan":"secoo_icon_xuanzhong";
                        switch(payWays[i].id){
                            case 2: // 银行汇款
                                html += ['<div class="paytype-item cell clell_border" payname="'+payObj[payWays[i].id]+'">',
                                    '<em class="pay-icon"><img src="'+payWays[i].payMethodIcon+'"/></em>',
                                    '<div class="cashier-first">',
                                    '<div class="bold">'+payWays[i].payName+'</div>',
                                    '<span>'+(payWays[i].desc || "")+'</span>',
                                    '</div>',
                                    '<span class="'+btnClass+'">',
                                    '<span class="path1"></span>',
                                    '<span class="path2"></span>',
                                    '</span>',
                                    '</div>'].join("");
                                break;
                            case 4: // 微信支付
                                html += ['<div class="paytype-item cell clell_border" payname="'+payObj[payWays[i].id]+'">',
                                    '<em class="pay-icon"><img src="'+payWays[i].payMethodIcon+'"/></em>',
                                    '<div class="cashier-first">',
                                    '<div class="bold">'+payWays[i].payName+'</div>',
                                    '<span>'+(payWays[i].desc || "")+'</span>',
                                    '</div>',
                                    '<span class="'+btnClass+'">',
                                    '<span class="path1"></span>',
                                    '<span class="path2"></span>',
                                    '</span>',
                                    '</div>'].join("");
                                break;
                            case 5: // 支付宝支付
                                html += ['<div class="paytype-item cell clell_border" payname="'+payObj[payWays[i].id]+'">',
                                    '<em class="pay-icon"><img src="'+payWays[i].payMethodIcon+'"/></em>',
                                    '<div class="cashier-first">',
                                    '<div class="bold">'+payWays[i].payName+'</div>',
                                    '<span>'+(payWays[i].desc || "")+'</span>',
                                    '</div>',
                                    '<span class="'+btnClass+'">',
                                    '<span class="path1"></span>',
                                    '<span class="path2"></span>',
                                    '</span>',
                                    '</div>'].join("");
                                break;
                            case 6: // 手机银行支付
                                html += ['<div class="paytype-item cell clell_border" payname="'+payObj[payWays[i].id]+'">',
                                    '<em class="pay-icon"><img src="'+payWays[i].payMethodIcon+'"/></em>',
                                    '<div class="cashier-first">',
                                    '<div class="bold">'+payWays[i].payName+'</div>',
                                    '<span>'+(payWays[i].desc || "")+'</span>',
                                    '</div>',
                                    '<span class="'+btnClass+'">',
                                    '<span class="path1"></span>',
                                    '<span class="path2"></span>',
                                    '</span>',
                                    '</div>'].join("");
                                break;
                            case 7: // 库支票支付
                                if(payWays[i].enable == 1){
                                    html += ['<div class="paytype-item cell clell_border" payname="'+payObj[payWays[i].id]+'">',
                                        '<em class="pay-icon"><img src="'+payWays[i].payMethodIcon+'"/></em>',
                                        '<div class="cashier-second">',
                                        '<div class="bold">'+payWays[i].payName+'</div>',
                                        '<span>'+payWays[i].subName+'</span>',
                                        '</div>',
                                        '<span class="'+btnClass+'">',
                                        '<span class="path1"></span>',
                                        '<span class="path2"></span>',
                                        '</span>',
                                        '</div>'].join("");
                                }else{
                                    html += ['<div class="paytype-item cell clell_border">',
                                        '<em class="pay-icon"><img src="'+payWays[i].payMethodIcon+'"/></em>',
                                        '<div class="cashier-second cashier-third">',
                                        '<div class="bold">'+payWays[i].payName+'</div>',
                                        '<span>'+payWays[i].subName+'</span>',
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
                    alert(result.retMsg);
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
    // 百度统计
    var _hmt = _hmt || [];(function() {var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?0b244704c105fcdb4c38b56ba154d77b";var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);})();
    $('#goPayBtn').on('click', function () {
        _hmt.push(['_trackEvent', 'payment', 'click', 'goPayAction']);
    });
});
