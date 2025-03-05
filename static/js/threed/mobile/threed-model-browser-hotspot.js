var flag;
var times;

$(function(){
    //屏幕大小变化  热点更改
    EleResize.on( $(".hotSpot_div")[0] , function(){
        hotSpot_reset()
    });
});

//热点初始化 initHotSpotDiv
function hotSpot_initDiv ( _data , status , arr ){
    if( !status ){
        status = "";
    }
    if( !arr ){
        arr = "";
        var top  = 0;
        var left = 0;
    }
    else{
        top  = arr.y;
        left = arr.x;
    }

    var _id    = _data.id;
    var _position_id = _data.hotspot_position_id;

    var data_str = JSON.stringify( _data );
    var $li = $(".hotSpot_ul li[position_id='"+_position_id+"']");
    if( $li.length < 1 ){
        var _HotSpotLi = '<li class="hotSpot_li '+status+'" position_id="'+ _position_id +'" hotSpot_id="'+ _id +'" style="top:'+ top +'px;left:'+ left +'px;">' +
                                '<div class="hotSpot_all_div">' +
                                    '<span class="icon icon_hotspot_span">' +
                                        '<div class="icon_hotspot_center">' +
                                            '<i class="icon icon_hotspot_back"></i>' +
                                            '<i class="icon icon_hotspot_circle"></i>' +
                                        '</div>' +
                                        '<p class="hotSpot_data" style="display: none">'+data_str+'</p>' +
                                    '</span>' +
                                '</div>' +
                            '</li>';
        $("ul.hotSpot_ul").append(_HotSpotLi);

        //具体内容具体样式
        var $new_li = $(".hotSpot_ul li[position_id='"+_position_id+"']");
        hotSpot_animateFun( $new_li );

        // if( _img && _audio  && _video  && _discrible){
        //     $new_li.find(".hotSpot_discrible_group").css({"border":"1px solid #e9e9e9", "border-left": "0px"});
        //     $new_li.find(".hotSpot_introduce").css({"margin-bottom":"10px"});
        // }
        // else if( !_img && !_audio  && _video  && _discrible ){
        //     $new_li.find(".hotSpot_discrible_group").css({"margin-bottom":"10px"});
        // }
        // else if( !_img && _audio  && !_video  && _discrible ){
        //     $new_li.find(".hotSpot_discrible_group >div").css({"padding":"22px 2px 0 10px"});
        // }
        // else if( !_img && _audio  && _video  && _discrible ){
        //     $new_li.find(".hotSpot_discrible_group >div").css({"border":"1px solid #e9e9e9","margin-bottom":"10px"});
        // }
        // else if( _img && !_audio  && _video  && _discrible ){
        //     $new_li.find(".hotSpot_introduce").css({"padding":"0px 10px","margin":"14px 0px"});
        //     $new_li.find(".hotSpot_discrible_group").css({"border":"1px solid #e9e9e9"});
        // }
        // else if( !_img && !_audio  && !_video  && _discrible ){
        //     $new_li.find(".hotSpot_discrible_group >div").css({"padding":"22px 6px 20px 10px"});
        // }
        // else if( _img && !_audio  && !_video  && !_discrible ){
        //     $new_li.find(".hotSpot_center_div").css({"height":"240px"});
        // }
        // else if( !_img && !_audio  && !_video  && !_discrible ){
        //     $new_li.find(".hotSpot_center_div").css({"height":"300px"});
        // }
        //
        // //对音频的内容填充
        // if( _audio ){
        //     hotSpot_media( true , $new_li );
        // }
        //
        // if( status == "active"){
        //     hotSpot_video( true  , $new_li );
        //     hotSpot_media( true , $new_li );
        // }
    }
    else{
        // if( status == "active" && $li.hasClass("hide") ){
        //     $li.removeClass("hide");
        //     hotSpot_video( true  , $li );
        //     hotSpot_media( true , $li );
        // }
        //
        // if( status  && $li.hasClass(status) ){
        //     $li.removeClass(status);
        // }
        // $li.addClass(status);
    }
}

//热点背景的变化 animateFun
function hotSpot_animateFun( $new_li ){
    var num = 0;
    function hotspot_back(){
        num++;
        if(num == 24){num=0;}
        var x = num*parseInt( $new_li.find(".icon_hotspot_back").width() );

        $new_li.find(".icon_hotspot_back").css({"background": "url('"+window.parent.frontend_cdn_url+"../img/threed/icon_hotspot_pointbg.png') no-repeat",
            "background-position":"-"+x+"px  0"});
    }
    setInterval(hotspot_back , 41.6666 );
}

//热点点击
$("ul.hotSpot_ul").on("click","li.hotSpot_li .icon_hotspot_span",function(){
    var $li = $(this).parent().parent();
    var $li_active = $(".hotSpot_ul >li.active");

    var data_str = $li.find(".hotSpot_data").html();
    var data_obj = JSON.parse( data_str );

    if( $li.hasClass("active") ){
        $li.removeClass("active").addClass("hide");
        window.parent.hotSpot_hideDetail();
    }
    else{
        if( $li_active.length > 0 ){
            $li_active.removeClass("active").addClass("hide");
        }
        window.parent.hotSpot_showDetail( data_obj );
    }
});

//热点界面显示隐藏
function hotSpot_showDiv ( flag ){
    if( flag ){
        $(".hotSpot_div").css({"display":"block"});
    }
    else{
        $(".hotSpot_div").css({"display":"none"});

        var $li = $(".hotSpot_ul li");
        for( var i = 0 ; i< $li.length ; i++ ){
            if( $li.eq(i).hasClass("active") ){
                $li.eq(i).removeClass("active");
                $li.eq(i).addClass("hide");
            }
        }
    }
}

//进度条
function hotSpot_process(event, param){
    var $body = $("body");
    var loading_div = '<div class="loading_div">' +
        '<div class="loading_center">' +
        '<div class="loading_progress" style="width: 30%"></div>' +
        '</div>' +
        '</div>';
    var $loading_progress;

    if( $body.find(".loading_div").length <= 0 ){
        $body.append(loading_div);
    }
    hotSpot_process_h();
    $loading_progress = $body.find(".loading_center .loading_progress");
    if( event == "start"){
        $loading_progress.css({"width": "0%"});
    }
    else if(event == "progress" ){
        $loading_progress.css({"width": parseInt(param)+"%"});
    }
    else{
        $loading_progress.css({"width": "100%"});
        setTimeout(function () {
            if( $body.find(".loading_div").length > 0 ){
                $body.find(".loading_div").remove();
            }
        },1*1000);
    }
}
function hotSpot_process_h() {
    var sreen_h = $("body").innerHeight();
    var $loading = $("body").find(".loading_div");

    $loading.css({"padding-top": (sreen_h/2)+"px"});
}

//全部热点位置重置 resetHotspot
function hotSpot_reset(){
    var $hotSpotLi = $("ul.hotSpot_ul").find(".hotSpot_li");
    for( var i = 0 ; i < $hotSpotLi.length ; i++ ){
        var id = parseInt( $hotSpotLi.eq(i).attr("position_id") );
        var x  = getHotSpotPosition( id ).x;
        var y  = getHotSpotPosition( id ).y;
        $hotSpotLi.eq(i).css({ "top" : y+"px" , "left": x+"px" });
    }
}
