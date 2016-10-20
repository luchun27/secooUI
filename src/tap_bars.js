//顶部导航
require('styles/tap_bars/tap.scss');
(function(){
    var $seach_label= $('#search_box .seach_label');
    var $secoo_logo= $('.search_all .secoo_logo');
    var $search_box= $('.search_all .search_box');
    var $search_close= $('.search_all .close');
    var $search_input= $('#search_input');
    $('#search_box').on('focus','#search_input',function(){
        $seach_label.hide();
        $secoo_logo.hide();
        $search_box.removeClass('seach_box_w');
    }).on('blur','#search_input',function(){
        console.log('blur');
        $search_box.addClass('seach_box_w');
        $secoo_logo.show();
        $seach_label.show();
    }).on('input','#search_input',function(){
        $search_close.removeClass('hide');
    }).on('touchend','.close',function(){
        $search_input.val('');
        $search_close.addClass('hide');
    }).on('touchend','.cannel',function(){
        $search_input.val('');
    });
})();


