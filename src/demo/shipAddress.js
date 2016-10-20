require('styles/demo/pay_main.scss');

//动态加载js
function dynamicLoad(scripyList,callback){
    var _doc = document.getElementsByTagName("head")[0];var _script = document.createElement("script");
    var _body = document.getElementsByTagName("body")[0];
    //循环加载js。
    _script.setAttribute("type","text/javascript");
    _script.setAttribute("src",scripyList[0]);
    _doc.appendChild(_script);
    _script.onload = function () {
        scripyList.splice(0, 1);
        if(scripyList.length){
            dynamicLoad(scripyList,callback);
        }else{
            callback && callback();
        }

    }
}
dynamicLoad([
    "http://mstatic.secooimg.com/js/android/zepto.min.js?t=20151120",
    "http://mstatic.secooimg.com/js/template-simple.js"
],function () {
    relReady();
});
function relReady(){
    var pubArgs = {
        "app_ver":"1.0",
        "channel":"",
        "device_id":"",
        "platform":"",
        "platform_type":"",
        "platform_ver":"",
        "screen_width":window.screen.width,
        "screen_height":window.screen.height
    };
    // 公共参数组合
    function argsMixin(param){
        if("upk" in param || !("c_upk" in param)){
            param.c_upk = getCookie("Sid");
            delete param.upk;
        }
        $.extend(param,pubArgs);
    }
    function getQueryString(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),a=window.location.search.substr(1).match(t);return null!=a?decodeURI(a[2]):null}
    // 读取cookies
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) return unescape(arr[2]);
        else return null;
    }
    // 跳转结算中心
    function jumpSettlement(address_id){
        var cart = getQueryString("cart");
        if(cart){
            if(address_id){
                cart = JSON.parse(cart);
                cart.shippingParam.shippingId = address_id;
                cart = JSON.stringify(cart);
            }
        }
        window.history.replaceState('', "", "http://m.secoo.com/reactSettlement/index.html?cart="+cart);
        window.history.go();
    }
    // 更新选择列表
    function updateSelectList(updateFlag){
        $.ajax({
            type:"get",
            url:"http://las.secoo.com/api/shipping/query?upk="+getCookie("Sid"),
            dataType:"json",
            success:function(data){
                console.log(data);
                // 选择收货地址列表
                if(data.retCode == 0){
                    shippingList = data.shippingList;
                    var s_temp = "",shippingId = "",cart = JSON.parse(getQueryString("cart"));
                    if(cart){
                        shippingId = cart.shippingParam.shippingId;
                    }
                    for(var i = 0; i < shippingList.length;i++){
                        var shippingList_i = shippingList[i];
                        s_temp += ['<li address_id="'+shippingList_i.id+'">',
                            '<div class="li-inner">',
                            '<div class="ad-info">',
                            '<div class="info-ref">',
                            '<div>'+shippingList_i.name+'</div><em>'+shippingList_i.phone+'</em>'+(shippingList_i.isDefault?'<span>默认</span>':''),
                            '</div>',
                            '<div class="info-des">'+shippingList_i.province+shippingList_i.city+shippingList_i.district+shippingList_i.address+'</div>',
                            '</div>',
                            '<div class="ad-line"></div>',
                            '<div class="ad-edit-btn secoo_icon_bianji"></div>',
                            '</div>',
                            (shippingId == shippingList_i.id || (!shippingId && shippingList_i.isDefault)?'<div class="line-color"></div>':''),
                            '</li>'].join("");
                    }
                    $("ul",s_address).eq(0).html(s_temp);
                    if(updateFlag){
                        // page切换
                        page_link("s-address-page-view",true);
                    }
                }
            }
        });
    }
    updateSelectList();
    // 保存
    var a_address = "";
    var shippingList = [];
    var s_address = $("#s-address-page-view");
    // 检查录入状态
    function checkStatu(mixinObj){
        var mixinObjLen = mixinObj.length;
        mixinObj.each(function(index){
            var value = $(this).val() != "";
            if(value && mixinObjLen == index+1){
                $(".secoo_btn",a_address).toggleClass("disabled",!value);
            }
            return value;
        });
    }
    /**
     * 初始化级联选择
     */
    function initAddress_ajax(callback){
        var address_mixin_data = window.localStorage.getItem("address_mixin_data");
        if(window.localStorage.getItem("address_mixin_data")){
            callback(JSON.parse(address_mixin_data));
        }else{
            $.ajax({
                type:"get",
                url:"http://lr.secooimg.com/address",
                dataType:"jsonp",
                success:function(data){
                    window.localStorage.setItem("address_mixin_data",JSON.stringify(data));
                    callback(data);
                }
            });
        }
    }
    function initAddress(callback){
        initAddress_ajax(function(mixin_data){
            var address = mixin_data.address,
                provinces = address.provinces,
                cities = address.cities,
                areas = address.areas;
            // 省
            var provinces_html = "<option value=''>请选择</option>",
                cities_obj = {},
                areas_obj = {};
            // 城市提取
            for(var i = 0; i < provinces.length; i++){
                provinces_html += '<option code="'+provinces[i].c+'" value="'+provinces[i].n+'">'+provinces[i].n+'</option>';
                cities_obj[provinces[i].c] = cities[provinces[i].c] || [];
            }
            // 区域提取
            for(var k in cities_obj){
                var cities_obj_k = cities_obj[k];
                for(var x = 0; x < cities_obj_k.length; x++){
                    var cities_c = cities_obj_k[x].c;
                    areas_obj[cities_c] = areas[cities_c] || [];
                }
            }
            var provinces_select = $("select[name='provinces']",a_address),
                cities_select = $("select[name='cities']",a_address),
                areas_select = $("select[name='areas']",a_address);

            provinces_select.html(provinces_html);

            provinces_select.on("change",function(){
                var value = $(this).val(),
                    code = $(this.options[this.selectedIndex]).attr("code"),
                    second_html = "<option value=''>请选择</option>";
                if(code) {
                    var cur_list = cities_obj[code];
                    for (var s = 0; s < cur_list.length; s++) {
                        second_html += '<option code="'+cur_list[s].c+'" value="' + cur_list[s].n + '">' + cur_list[s].n + '</option>';
                    }
                }
                cities_select.html(second_html);
                areas_select.html("<option value=''>请选择</option>");
                var allInput = a_address.find("input"),
                    allSelect = a_address.find("select");
                var mixinObj = allInput.add(allSelect);
                checkStatu(mixinObj);
            });
            cities_select.on("change",function(){
                var value = $(this).val(),
                    code = $(this.options[this.selectedIndex]).attr("code"),
                    areas_html = "<option value=''>请选择</option>";
                if(code){
                    var cur_list = areas_obj[code];
                    for(var s = 0; s < cur_list.length; s++){
                        areas_html += '<option code="'+cur_list[s].c+'" value="'+cur_list[s].n+'">'+cur_list[s].n+'</option>';
                    }
                }
                areas_select.html(areas_html);
                var allInput = a_address.find("input"),
                    allSelect = a_address.find("select");
                var mixinObj = allInput.add(allSelect);
                checkStatu(mixinObj);
            });
            areas_select.on("change",function(){
                var allInput = a_address.find("input"),
                    allSelect = a_address.find("select");
                var mixinObj = allInput.add(allSelect);
                checkStatu(mixinObj);
            });
            callback && callback();
        });
    }
    /**
     * 设置默认地址,选择项事件
     * @param area_ctx
     */
    function setDefault_evens(area_ctx){
        area_ctx = area_ctx || document;
        var old_class = "";
        $(".ad-control",area_ctx).on("tap",function(){
            var control_df = $(this).find(".control-default"),
                cur_btn = control_df.children("span");
            if(control_df.hasClass("dis-btn")) return;
            if(control_df.hasClass("selected")){
                control_df.removeClass("selected");
                cur_btn.attr("class",old_class);
            }else{
                control_df.addClass("selected");
                old_class  = cur_btn.attr("class");
                cur_btn.attr("class","secoo_icon_xuanzhong_red");
            }
        });
    }
    // 新增、编辑地址
    function mixinCfgAddress(id_obj){
        var addressee = $.trim($("input[name='addressee']", a_address).val()), // 收件人
            contact = $.trim($("input[name='contact']", a_address).val()), // 联系方式
            provinces = $("select[name='provinces']", a_address).val(), // 省/直辖市
            cities = $("select[name='cities']", a_address).val(), // 所在城市
            areas = $("select[name='areas']", a_address).val(), // 所在区/县
            address = $.trim($("input[name='address']", a_address).val()), // 详细地址
            isDefault = $(".ad-control .control-default", a_address).hasClass("selected");
        var msg_text = "";
        if (!(/^0?(13[0-9]|15[0-9]|18[0-9]|17[0-9]|14[0-9])[0-9]{8}$/.test(contact))){
            msg_text = "手机号格式错误";
        }else if(provinces == ""){
            msg_text = "请选择省/直辖市";
        }else if(cities == ""){
            msg_text = "请选择所在城市";
        }else if(areas == ""){
            msg_text = "请选择所在区/县";
        }else if(!(/.*[\u4e00-\u9fa5].*/.test(address))) {
            msg_text = "详细地址需包含中文字符";
        }
        if(msg_text != ""){
            alert(msg_text);
        }else{
            $.ajax({
                type:"get",
                url:"http://las.secoo.com/api/shipping/save?upk="+getCookie("Sid"),
                beforeSend:function(){
                    $(".secoo_btn",a_address).addClass("dis-btn");
                },
                data:$.extend({
                    province:provinces,
                    city:cities,
                    district:areas,
                    address:address,
                    isDefault:isDefault,
                    name:addressee,
                    phone:contact
                },id_obj),
                dataType:"jsonp",
                success:function(data){
                    console.log(data);
                    if(data.retCode == 0){
                        jumpSettlement(id_obj?id_obj.id:data.id);
                        updateSelectList(true);
                    }else{
                        alert(data.retMsg);
                    }
                },
                complete:function(){
                    $(".secoo_btn",a_address).removeClass("dis-btn");
                }
            });
        }
    }
    /**
     *  统一页面切换
     */
    function page_link(view,flag){
        view = $("#"+view);
        view.addClass("selected");
        if(flag){
            view.siblings(".selected").remove();
        }else{
            view.siblings(".selected").removeClass("selected");
        }
    }
    // 输入框长度限制,控制状态控制
    function inputMaxLen(ctx){
        var allInput = ctx.find("input"),
            allSelect = ctx.find("select");
        var mixinObj = allInput.add(allSelect);
        allInput.on("input",function(){
            var dThis = $(this),
                value = dThis.val(),
                maxLen = dThis.attr("maxlen");
            if(maxLen && value.length > maxLen){
                dThis.val(value.slice(0,maxLen));
            }
            checkStatu(mixinObj);
        });
    }
    // 添加收货地址
    $("#add_address_page").on("tap",function(){
        if(s_address.find("ul li").length >= 10){
            alert("最多添加10条地址");
            return;
        }
        var htmlStr = template.render('mixinAddress_tmpl',{title:"添加收货地址",del:false});
        $("body").append(htmlStr);
        a_address = $("#a-address-page-view");
        // page切换
        page_link("a-address-page-view");

        initAddress();
        inputMaxLen(a_address);
        setDefault_evens(a_address);
        // 保存并使用
        $(".secoo_btn",a_address).on("tap",function() {
            if($(this).hasClass("dis-btn") || $(this).hasClass("disabled")) return;
            mixinCfgAddress();
        });
        // 清空输入框内容
        $(".cell .close_box").on("tap",function(){
            $(this).siblings("input").val("").focus();
            $(".secoo_btn",a_address).toggleClass("disabled",true);
        });
        // 显示删除图标
        $(".cell input").on("input",function(){
            var inputFlag = $.trim($(this).val()) != "";
            $(this).siblings(".close_box").toggle(inputFlag);
        }).trigger("input");
        // 添加/修改地址 返回选择地址列表页
        $("header .back",a_address).on("tap",function(){
            // page切换
            page_link("s-address-page-view",true);
        });
    });
    // 选择收货地址
    s_address.on("click","ul li",function(event) {
        if($(event.target).hasClass("ad-edit-btn")) return;
        var address_id = $(this).attr("address_id");
        jumpSettlement(address_id);
    });
    // 返回结算中心
    s_address.on("tap","header .back",function() {
        var address_id = $(this).attr("address_id");
        jumpSettlement();
    });
    // 修改收货地址
    s_address.on("click",".ad-edit-btn",function(e) {
        e = e || window.event;
        e.stopPropagation();
        e.preventDefault();
        var address_li = $(this).closest("li"),
            address_id = address_li.attr("address_id"),
            cur_address = {};
        $.each(shippingList,function(){
            if(this.id == address_id){
                cur_address = this;
                return false;
            }
        });
        var htmlStr = template.render('mixinAddress_tmpl',{title:"编辑收货地址",del:true,isDefault:cur_address.isDefault});
        $("body").append(htmlStr);
        a_address = $("#a-address-page-view");
        initAddress(function(){
            $("select[name='provinces']", a_address).val(cur_address.province).trigger("change"); // 省/直辖市
            $("select[name='cities']", a_address).val(cur_address.city).trigger("change"); // 所在城市
            $("select[name='areas']", a_address).val(cur_address.district).trigger("change"); // 所在区/县
            setDefault_evens(a_address);
            $("input[name='addressee']", a_address).val(cur_address.name); // 收件人
            $("input[name='contact']", a_address).val(cur_address.phone); // 联系方式
            // page切换
            page_link("a-address-page-view");
        });
        $("input[name='address']", a_address).val(cur_address.address); // 详细地址
        inputMaxLen(a_address);
        // 保存并使用
        $(".secoo_btn",a_address).on("tap",function() {
            if($(this).hasClass("dis-btn") || $(this).hasClass("disabled")) return;
            mixinCfgAddress({id:cur_address.id});
        });
        // 清空输入框内容
        $(".cell .close_box").on("tap",function(){
            $(this).siblings("input").val("").focus();
            $(".secoo_btn",a_address).toggleClass("disabled",true);
        });
        // 显示删除图标
        $(".cell input").on("input",function(){
            var inputFlag = $.trim($(this).val()) != "";
            $(this).siblings(".close_box").toggle(inputFlag);
        }).trigger("input");
        // 添加/修改地址 返回选择地址列表页
        $("header .back",a_address).on("tap",function(){
            // page切换
            page_link("s-address-page-view",true);
        });
        $("header .more",a_address).on("tap",function(){
            if(window.confirm('确定要删除此地址?')){
                // 删除
                $.ajax({
                    type:"get",
                    url:"http://las.secoo.com/api/shipping/delete?upk="+getCookie("Sid"),
                    data:{
                        id:cur_address.id
                    },
                    dataType:"json",
                    success:function(data){
                        console.log(data);
                        if(data.retCode == 0){
                            updateSelectList(true);
                        }else{
                            alert(data.retMsg);
                        }
                    }
                });
            }
        });
    });
}