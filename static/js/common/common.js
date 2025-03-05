//--------截取字符串长度
var strlen = function( str , max_len ) {
    var len = 0;

    var str_min = '';
    if( str.length > 0 ){
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);

            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                len++;
            }
            //双字节加2
            else {
                len += 2;
            }

            if( len <= max_len){
                str_min += str.substring(i,i+1);
            }else {
                str_min += '';
            }
        }
        if( len > max_len){
            str_min += '...'
        }
    }
    else{
        str_min = ''
    }


    return str_min;
};

//---获取背景
function setThreedBgUrl ( backUrl ){
    var backUrls;
    if(  parseInt( backUrl ) == 1 ){
        backUrls = parseInt("0x42424d");
    }
    else{
        backUrls = parseInt("0xe9eaef");
    }

    return backUrls;
};

//---根据背景添加class
function setScreenClass ( backVal ){
    if(  parseInt( backVal ) == 1 ){
        $(".screen_div").removeClass("whitebg").addClass("blackbg");
    }
    else{
        $(".screen_div").removeClass("blackbg").addClass("whitebg");
    }
};

//---移动端背景滚动
function mobileScreenFun ( backid ){
    var arry  = [0,1];
    var index = $.inArray( parseInt(backid), arry);

    var backids;
    if( index+1 <= arry.length-1 ){
        backids = arry[index+1];
    }
    else {
        backids = arry[0];
    }

    return backids;
};

var getUrlParam = function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
};

//页面高度调整
function screen(){
    var window_h = $(window).outerHeight(true);
    var header_h = 0 ,footer_h = 0;
    var secContain_h = 0;
    $("section>div").each( function(){
        secContain_h += $(this).outerHeight(true);
    } );

    if( $("body").find('header').length > 0 || $("body").find('footer').length > 0 ){

        if( $("body").find('header').length > 0 ){
            header_h = $("header").outerHeight(true);
        }
        if( $("body").find('footer').length > 0 ){
            footer_h = $("footer").outerHeight(true);
        }
    }

    if( window_h >= ( header_h + secContain_h + footer_h)){
        $("section").css({"height":(window_h  - header_h - footer_h)+"px"});
    }
    else {
        $("section").css({"height":secContain_h+"px"});
    }
}