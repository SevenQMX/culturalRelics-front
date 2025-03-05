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

    var hotSpot_center = '';
    var hot_discrible  = '';
    var hotSpot_center_class = "hotSpot_center_narrow";
    var _id = _data.id;
    var _img   = _data.hotspot_img_url;
    var _audio = _data.hotspot_audio_url;
    var _video = _data.hotspot_video_url;
    var _title = _data.hotspot_title;
    var _discrible   = _data.hotspot_describe;
    var _position_id = _data.hotspot_position_id;

    //设置文本内容
    if( _discrible ){
        if( _title ){
            _title = '<span class="hotSpot_title">'+_title+'</span>';
        }
        _discrible = '<div class="hotSpot_discrible_group">' +
                        '<div class="hotSpot_discrible_div">' +
                            _title+'<span class="hotSpot_discrible">'+_discrible+'</span>' +
                        '</div>' +
                    '</div>';
    }
    else{
        _discrible = '';
    }

    if( _img ){
        _img = '<div class="img_div">' +
                    '<img src="'+_img+'">' +
                '</div>';
    }
    else{
        _img = '';
    }

    if( _audio ){
        _audio = '<div class="audio_group">' +
                    '<audio class="audio" name="audio" src="'+ _audio +'"></audio>' +
                    '<div class="audio_div">' +
                        '<span class="icon icon_audio" status="off"></span>' +
                        '<ul class="audio_process_ul">' +
                            '<li class="audio_name">' +
                                '<span class="audio_title"></span>' +
                                '<span class="audio_time">' +
                                    '<span class="audio_time_process"></span>/' +
                                    '<span class="audio_time_all"></span>' +
                                '</span>' +
                            '</li>' +
                            '<li class="audio_process"><div style="width: 0%"></div></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>';
    }
    else{
        _audio = '';
    }
    if( _video ){
        _video = '<div class="video_div">' +
                    '<i class="icon icon_video_full"></i>' +
                    '<iframe setsrc="'+ _video +'" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>' +
                '</div>'
    }
    else{
        _video = '';
    }

    //想热点界面添加内容并且设置单独的样式
    //宽热点
    if( ((_img && (_video || _audio) ) && !_discrible) || ((_img && (_discrible  || _audio) ) && !_video)){
        hot_discrible = "<div class='hotSpot_introduce'>"+ _img + _video + _discrible + "</div>";

        hotSpot_center_class = "hotSpot_center_wide";
        hotSpot_center = '<div  class="hotSpot_center_div '+hotSpot_center_class +'">' +
                            hot_discrible +  _audio  +
                        '</div>';
    }
    //窄热点
    else{
        //图片描述详解
        if( _img && _discrible ){
            hot_discrible = "<div class='hotSpot_introduce'>"+ _img + _discrible + "</div>";
        }
        else{
            hot_discrible = _img + _discrible;
        }

        hotSpot_center_class = "hotSpot_center_narrow";
        if( _video){
            hotSpot_center = '<div  class="hotSpot_center_div '+hotSpot_center_class +'">' +
                                _video + _audio + hot_discrible +
                            '</div>';
        }
        else{
            hotSpot_center = '<div  class="hotSpot_center_div '+hotSpot_center_class +'">' +
                                _img + _discrible + _audio +
                            '</div>';
        }
    }
    var $li = $(".hotSpot_ul li[position_id='"+_position_id+"']");

    if( $li.length < 1 ){
        var _HotSpotLi = '<li class="hotSpot_li '+status+'" position_id="'+ _position_id +'" hotSpot_id="'+ _id +'" style="top:'+ top +'px;left:'+ left +'px;">' +
                                '<div class="hotSpot_all_div">' +
                                    '<span class="icon icon_hotspot_span">' +
                                        '<div class="icon_hotspot_center">' +
                                            '<i class="icon icon_hotspot_back"></i>' +
                                            '<i class="icon icon_hotspot_circle"></i>' +
                                        '</div>' +
                                    '</span>' +
                                    hotSpot_center +
                                '</div>' +
                            '</li>';
        $("ul.hotSpot_ul").append(_HotSpotLi);

        //具体内容具体样式
        var $new_li = $(".hotSpot_ul li[position_id='"+_position_id+"']");
        if( _img && _audio  && _video  && _discrible){
            $new_li.find(".hotSpot_discrible_group").css({"border":"1px solid #e9e9e9", "border-left": "0px"});
            $new_li.find(".hotSpot_introduce").css({"margin-bottom":"10px"});
        }
        else if( !_img && !_audio  && _video  && _discrible ){
            $new_li.find(".hotSpot_discrible_group").css({"margin-bottom":"10px"});
        }
        else if( !_img && _audio  && !_video  && _discrible ){
            $new_li.find(".hotSpot_discrible_group >div").css({"padding":"22px 2px 0 10px"});
        }
        else if( !_img && _audio  && _video  && _discrible ){
            $new_li.find(".hotSpot_discrible_group >div").css({"border":"1px solid #e9e9e9","margin-bottom":"10px"});
        }
        else if( _img && !_audio  && _video  && _discrible ){
            $new_li.find(".hotSpot_introduce").css({"padding":"0px 10px","margin":"14px 0px"});
            $new_li.find(".hotSpot_discrible_group").css({"border":"1px solid #e9e9e9"});
        }
        else if( !_img && !_audio  && !_video  && _discrible ){
            $new_li.find(".hotSpot_discrible_group >div").css({"padding":"22px 6px 20px 10px"});
        }
        else if( _img && !_audio  && !_video  && !_discrible ){
            $new_li.find(".hotSpot_center_div").css({"height":"240px"});
        }
        else if( !_img && !_audio  && !_video  && !_discrible ){
            $new_li.find(".hotSpot_center_div").css({"height":"300px"});
        }

        //对音频的内容填充
        if( _audio ){
            hotSpot_media( true , $new_li );
        }
        hotSpot_animateFun( $new_li );

        if( status == "active"){
            hotSpot_video( true  , $new_li );
            hotSpot_media( true , $new_li );
        }
    }
    else{
        if( status == "active" && $li.hasClass("hide") ){
            $li.removeClass("hide");
            hotSpot_video( true  , $li );
            hotSpot_media( true , $li );
        }

        if( status  && $li.hasClass(status) ){
            $li.removeClass(status);
        }
        $li.addClass(status);
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

//热点界面显示隐藏 showHotSpotDiv
function hotSpot_showDiv ( flag ){
    if( flag ){
        //$(".hotSpot_div").css({"display":"block"});
    }
    else{
        //$(".hotSpot_div").css({"display":"none"});

        var $li = $(".hotSpot_ul li");
        for( var i = 0 ; i< $li.length ; i++ ){
            //关闭音频，视频，删除active，添加hide
            hotSpot_video( false , $li.eq(i) );
            hotSpot_media( false , $li.eq(i) );
            if( $li.eq(i).hasClass("active") ){
                $li.eq(i).removeClass("active");
                $li.eq(i).addClass("hide");
            }
        }
    }
}
//热点显示隐藏 showHotSpot
function hotSpot_showLi ( flag , id ){
    var $hotSpotLi = $("ul.hotSpot_ul >li");
    for( var i = 0 ; i < $hotSpotLi.length ; i++ ){
        var position_id = $hotSpotLi.eq(i).attr("position_id");
        if( flag && ( position_id == ""+id ) ){
            $hotSpotLi.eq(i).removeClass("hide").addClass("active");
            hotSpot_video( true  , $hotSpotLi.eq(i) );
            hotSpot_media( true  , $hotSpotLi.eq(i) );
        }
        else {
            $hotSpotLi.eq(i).removeClass("active").addClass("hide");
            hotSpot_media( false  , $hotSpotLi.eq(i) );
            hotSpot_media( false  , $hotSpotLi.eq(i) );
        }
    }
}

//视频 hotspot_video
function hotSpot_video( flag  , $li ) {
    var $iframe = $li.find("iframe");
    var _src    = $iframe.attr("setsrc");

    if( $iframe.length > 0 ){
        if( flag ){
            $iframe.attr("src", _src);
        }
        else {
            $iframe.attr("src", "");
        }
    }
}

//音乐 hotspot_media  second
function hotSpot_media( flag , $li ){
    var $media = $li.find(".audio_group");

    if( $media.length > 0  ){
        //关闭热点时候，关闭音乐然后重置
        if( !flag ){
            var $audio   = $li.find("audio")[0];
            if( $audio ){
                $audio.pause();
                $audio.load();
                $li.find(".icon.icon_audio").attr({"status":"off"});
                $li.find(".audio_process >div").css({"width": 0+"%"});
                $li.find(".audio_time_process").html( "00:00" );
            }
        }
        //添加音乐时候，样式进度条休整
        else {
            var $audio = $li.find("audio")[0];
            getTime();
            function getTime() {
                setTimeout(function () {
                    var duration = $audio.duration;
                    if( isNaN(duration) ){
                        getTime();
                    }
                    else{
                        var duration_times = Math.ceil( duration );
                        $li.find(".audio_time_all").html( hotSpot_second ( duration_times ) );
                        $li.find(".audio_time_process").html( "00:00" );
                    }
                }, 1000 );
            }
            var path = $audio.src.replace(/\\/g,'/');
            var audio_name = path.substring(path.lastIndexOf("/")+1,path.length);
            $li.find(".audio_title").html( strlen(audio_name , 16) );
        }
    }

}
function hotSpot_second ( times ){
    var second  = Math.ceil( (times) %  60 );
    var minutes = Math.floor( (times) %  3600/60 );
    var hours   = Math.floor( (times) %  (24*3600)/3600 );
    if( second >= 1 ){
        if( second.length > 1 ){
            second = second;
        }
        else{
            second = "0"+second;
        }
    }
    else{
        second = "00";
    }
    if( minutes >= 1 ){
        if( minutes.length > 1 ){
            minutes = minutes;
        }
        else{
            minutes = "0"+minutes;
        }
    }
    else{
        minutes = "00";
    }
    if( hours >= 1 ){
        if( hours.length > 1 ){
            hours = hours+":";
        }
        else{
            hours = "0"+hours+":";
        }
    }
    else{
        hours = "";
    }

    return hours+minutes+":"+second ;
}

//进度条 hotspot_process hotspot_process_h
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

//全部热点位置重置 deletHotspot
function hotSpot_deletLi( id ){
    var $hotSpotLi = $("ul.hotSpot_ul").find(".hotSpot_li[position_id='"+id+"']");
    $hotSpotLi.remove();
}

function hotSpot_fullHeight(){
    var sreen_h = $("body").innerHeight();
    var full_h  = $(".screen_center_div").innerHeight();

    if( full_h >= sreen_h){
        $(".screen_center_div").css({"margin-top":"0px"});
    }
    else {
        var margin = (sreen_h-full_h)/2;
        $(".screen_center_div").css({"margin-top": margin+"px"});
    }
}

//热点点击
$("ul.hotSpot_ul").on("click","li.hotSpot_li .icon_hotspot_span",function( ){
    var $li = $(this).parent().parent();
    var $li_active = $(".hotSpot_ul >li.active");

    if( $li.hasClass("active") ){
        $li.removeClass("active").addClass("hide");
        hotSpot_video( false , $li );
        hotSpot_media( false , $li )
    }
    else{
        if( $li_active.length > 0 ){
            hotSpot_media( false , $li_active );
            hotSpot_video( false , $li_active );
            $li_active.removeClass("active").addClass("hide");
        }

        hotSpot_video( true  , $li );
        $li.removeClass("hide").addClass("active");
    }
});

//音频播放暂停
$("ul.hotSpot_ul").on("click","li.hotSpot_li .icon.icon_audio",function(){
    var $btn = $(this);
    var $li  = $(this).parents("li");
    var $audio   = $li.find("audio")[0];
    var status   = $(this).attr("status");
    var duration = $audio.duration;

    if( status == "on" ){
        $btn.attr({"status":"off"});
        $audio.pause();
    }
    else{
        $btn.attr({"status":"on"});
        $audio.play();
        //显示进度
        var audio_times = setInterval( function(){
            var current = $audio.currentTime;
            $li.find(".audio_process >div").css({"width": (current/duration*100).toFixed(2)+"%"});
            $li.find(".audio_time_process").html( hotSpot_second ( current ) );

            if( duration == current ){
                clearInterval( audio_times );
                $btn.attr({"status":"off"});
                $audio.pause();
                $li.find(".audio_process >div").css({"width": 0+"%"});
                $li.find(".audio_time_process").html( "00:00" );
            }
        } ,50);
    }
});

//播放视屏，关闭音乐
$("ul.hotSpot_ul").on("click","li.hotSpot_li .video_div",function( ){

});

//打开视屏/图片
$("ul.hotSpot_ul").on("click","li.hotSpot_li .icon_video_full,li.hotSpot_li .img_div img",function(){
    var $li  = $(this).parents(".hotSpot_li");

    var img_class = '' ,next_string = '';
    var url = '';
    if( $(this).hasClass("icon_video_full") ){
        url = $(this).next().attr("src");
        img_class = 'iframe_bg';
        next_string = '<iframe src="'+ url +'" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>';
    }
    else {
        url = $(this).attr("src");
        img_class = 'img_bg';
        next_string = '<img src="'+url+'">';
    }

    var hotspot_id = $li.attr("hotspot_id");

    var full_screen = '<div class="screen_full_div" hotspot_id="'+hotspot_id+'">' +
                            '<div class="screen_center_div">' +
                                '<div class="screen_bg_color '+img_class+'">' +
                                    '<i class="icon icon_close"></i>' + next_string+
                                '</div>' +
                            '</div>' +
                        '</div>';
    $("body").append(full_screen);

    //暂停小视屏小音频
    hotSpot_video( false , $li);
    hotSpot_media( false , $li);

    hotSpot_fullHeight();
});

//关闭视屏/图片
$("body").on("click",".screen_full_div .icon_close",function(){
    var hotspot_id = $(this).parents(".screen_full_div").attr("hotspot_id");
    var $li        = $(".hotSpot_ul li[hotspot_id='"+hotspot_id+"']");
    hotSpot_video( true , $li);

    var $screenFullDiv = $(this).parents(".screen_full_div");
    $screenFullDiv.remove();
});