//顶部导航
require('styles/panel/panel.scss');
//顶部导航
require('styles/tap_bars/tap.scss');
require('styles/pay_main.scss');
!function(a,b){var c=a.documentElement,d="orientationchange"in window?"orientationchange":"resize",e=function(){var a=c.clientWidth;a&&(c.style.fontSize=16*(a/320)+"px")};a.addEventListener&&(b.addEventListener(d,e,!1),a.addEventListener("DOMContentLoaded",e,!1))}(document,window);
