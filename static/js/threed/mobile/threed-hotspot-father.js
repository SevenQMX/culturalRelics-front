//添加热点界面
function hotSpot_showDetail( _data ) {
    var $screen_w = $(window).innerWidth();
    var _id    = _data.id;
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
                            '<ul class="audio_process_ul" style="width: '+ ($screen_w-60)+'px">' +
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
                        '<iframe src="'+ _video +'" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>' +
                    '</div>'
    }
    else{
        _video = '';
    }


    var detail_div = '<div class="hotSpot_detail_div">' +
                        '<i class="icon icon_hotspot_remove"></i>' +
                        _video + _audio + _discrible + _img +
                    '</div>';

    $(".screen_div").append(detail_div);
    hotSpot_DetailH();

    var $detail_div = $(".hotSpot_detail_div");
    hotSpot_media( true , $detail_div );

    silider();
};
function silider() {
    var times = window.setInterval(function() {
        var $hotSpot_detail = $('.hotSpot_detail_div')[0];
        if( $('.hotSpot_detail_div').length > 0){
            window.clearInterval(times);

            var $hotSpot_top = 0;
            var detail_h = 0;
            $(".hotSpot_detail_div>div").each( function(){
                detail_h += $(this).outerHeight(true);
            } );

            var  startY, endY, distanceY;
            $hotSpot_detail.addEventListener('touchstart', function ( e ) {
                startY = e.changedTouches[0].pageY;
                $hotSpot_top = $('.hotSpot_detail_div').scrollTop();
            }, false );
            $hotSpot_detail.addEventListener('touchmove', function ( e ) {
                //获取滑动屏幕时的X,Y
                endY = e.changedTouches[0].pageY;
                //获取滑动距离
                distanceY = (endY-startY)/2;
                if( distanceY > 10  || distanceY < -10 ){
                    $hotSpot_top = $hotSpot_top - distanceY;
                    $('.hotSpot_detail_div').scrollTop( $hotSpot_top );
                }
            } );
        }
    }, 10);
}

function hotSpot_hideDetail() {
    var $hotSpot_detail = $(".hotSpot_detail_div");
    if( $hotSpot_detail.length > 0 ){
        $hotSpot_detail.remove();
    }
    else {
        return false
    }
}
function hotSpot_DetailH() {
    var screen_h = $(".screen_div").innerHeight();
    var detail_h = 0;
    $(".hotSpot_detail_div>div").each( function(){
        detail_h += $(this).outerHeight(true);
    } );

    if( screen_h > detail_h ){
        $(".hotSpot_detail_div").css({"padding-top": (screen_h-detail_h)/2+"px"});
    }
    else {
        $(".hotSpot_detail_div").css({"overflow-y":"scroll"});
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

//音频播放暂停
$(".screen_div").on("click",".hotSpot_detail_div .audio_group .icon_audio",function(){
    var $btn = $(this);
    var $li  = $(this).parents(".hotSpot_detail_div");
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

//关闭热点显示
$(".screen_div").on("click",".hotSpot_detail_div .icon_hotspot_remove",function(){
    var $hotSpot_detail = $(this).parent();
    $hotSpot_detail.remove();
});