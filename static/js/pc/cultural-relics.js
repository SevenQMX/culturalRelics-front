var Inpage = function() {
    var _csrf_name  = $('meta[name="csrf-param"]').attr("content");
    var _csrf_token = $('meta[name="csrf-token"]').attr("content");
    var iframe      = $("#iframe")[0];
    var _id         = getUrlParam("id");

    var initPage = function () {
        var _url = '../../json/cultural-relics.json';
        var _data = {};
        _data[_csrf_name] = _csrf_token;
        _data.id = _id;

        iframe.onload = function () {
            $ajax( _url , _data , function( data ){

                if( !$.isEmptyObject(data.data.items) ){
                    var datas = data.data.items;

                    //模型
                    iframe.contentWindow.loadModel( datas.goods_obj_file_url, datas.goods_texture_file_url+"?t="+(new Date()).getTime() , datas.goods_mtl_file_url );
                    iframe.contentWindow.setCameraParam( parseFloat(datas.camera_pose_x) ,parseFloat(datas.camera_pose_y) ,parseFloat(datas.camera_pose_z) ,  parseFloat(datas.camera_range) );
                    iframe.contentWindow.setLightingScheme( datas.lighting  );
                    iframe.contentWindow.setBackgroundColor( setThreedBgUrl ( datas.backdrop ) );

                    //热点
                    if( !$.isEmptyObject(datas.hotspot) ) {
                        $(".btn_group .hotspot_btn").addClass("active");
                        iframe.contentWindow.hotSpot_showDiv( true );
                        $.each( datas.hotspot , function( index , value ){
                            iframe.contentWindow.hotSpot_initDiv ( value , "hide" );
                        });
                    }
                    $(".backimg_ul li[value='"+ parseInt(datas.backdrop)+"']").addClass("active");
                    setScreenClass ( datas.backdrop );

                    //模型热点添加
                    iframe.contentWindow.setModelStateCallback(function (event, param) {
                        iframe.contentWindow.hotSpot_process(event, param);
                        if( event == "loaded"){
                            $.each( datas.hotspot , function( index , value ){
                                iframe.contentWindow.addHotSpot(
                                    parseInt(value.hotspot_position_id),
                                    parseFloat(value.hotspot_x),
                                    parseFloat(value.hotspot_y),
                                    parseFloat(value.hotspot_z)
                                );
                            });
                        }
                    });

                    //屏幕热点相对坐标
                    iframe.contentWindow.setHotSpotScreenPosCallback(function ( id, x, y , opacity ) {
                        var $hotSpot_ul = $("#iframe").contents().find(".hotSpot_ul");
                        if( $hotSpot_ul.find("li[position_id='"+id+"']").length > 0){
                            $hotSpot_ul.find("li[position_id='"+id+"']").css({"top":y+"px","left":x+"px"}).animate({opacity:1},200);
                            $hotSpot_ul.find("li[position_id='"+id+"'] .icon_hotspot_back").css({"opacity": opacity});
                            $hotSpot_ul.find("li[position_id='"+id+"'] .icon_hotspot_circle").css({"opacity": opacity});
                        }
                        else{
                            setTimeout(function(){
                                if( $hotSpot_ul.find("li[position_id='"+id+"']").length > 0){
                                    $hotSpot_ul.find("li[position_id='"+id+"']").css({"top":y+"px","left":x+"px"}).animate({opacity:1},200);
                                    $hotSpot_ul.find("li[position_id='"+id+"'] .icon_hotspot_back").css({"opacity": opacity});
                                    $hotSpot_ul.find("li[position_id='"+id+"'] .icon_hotspot_circle").css({"opacity": opacity});
                                }
                            },"100");
                        }
                    });

                    //页面详情
                    var $info_div = $(".info_div");
                    $info_div.append('<span class="title">'+datas.title+'</span>');
                    if (datas.years_text != "暂无")
                        $info_div.append('<span class="dates">'+datas.years_text+'</span>');
                    if (datas.goods_type_text != "暂无")
                        $info_div.append('<span class="tag">'+datas.goods_type_text+'</span>');
                    if (datas.material_text != "暂无")
                        $info_div.append('<span class="tag">'+datas.material_text+'</span>');
                    if (datas.source_text != "暂无")
                        $info_div.append('<span class="tag">'+datas.source_text+'</span>');

                    //模型详情
                    var $cultural_relics_div = $(".cultural_relics_center");
                    $cultural_relics_div.find(".center_title").html( datas.title );
                    if (datas.years_text == "暂无"){
                        $cultural_relics_div.find(".center_date").hide();
                    } else {
                        $cultural_relics_div.find(".center_date").html( datas.years_text );
                    }
                    if (datas.goods_type_text == "暂无"){
                        $cultural_relics_div.find("li[name='style']").hide();
                    } else {
                        $cultural_relics_div.find("li[name='style'] span").html( datas.goods_type_text );
                    }
                    if (datas.material_text == "暂无"){
                        $cultural_relics_div.find("li[name='material']").hide();
                    } else {
                        $cultural_relics_div.find("li[name='material'] span").html( datas.material_text );
                    }
                    if (datas.goods_level_text == "暂无"){
                        $cultural_relics_div.find("li[name='goods_level']").hide();
                    } else {
                        $cultural_relics_div.find("li[name='goods_level'] span").html( datas.goods_level_text );
                    }
                    if (datas.source_text == "暂无"){
                        $cultural_relics_div.find("li[name='source']").hide();
                    } else {
                        $cultural_relics_div.find("li[name='source'] span").html( datas.source_text );
                    }
                    if (datas.purpose){
                        $cultural_relics_div.find("li[name='purpose'] span").html( datas.purpose );
                    } else {
                        $cultural_relics_div.find("li[name='purpose']").hide();
                    }
                    // $cultural_relics_div.find("li[name='source'] span").html( datas.source_text );
                    // $cultural_relics_div.find("li[name='purpose'] span").html( datas.purpose );

                    if (datas.volume){
                        $cultural_relics_div.find("li[name='volume'] span").html(datas.volume);
                    } else {
                        $cultural_relics_div.find("li[name='volume']").hide();
                    }

                    if (datas.describe){
                        $cultural_relics_div.find(".discrible_center").html( datas.describe );
                    } else {
                        $cultural_relics_div.find(".center_discrible").hide();
                    }

                    //qrcode
                    //$(".qrcode_div img").attr("src", datas.ShareImgUrl );
                }
            });
        };
    };

    var operationFun = function(){
        //文物详情打开关闭
        $(".btn_group").on("click",".menu_btn",function(){
            menuStatusFun( true );
            //hotspotStatusFun( false );
            rulerStatusFun( false );
            qrcodeStatusFun( false );

        });
        $(".cultural_relics_div").on("click",".icon_arrow_right",function(){
            menuStatusFun( false );
        });

        //热点打开关闭
        $(".btn_group").on("click",".hotspot_btn",function(){
            if( $(this).hasClass("active") ){
                hotspotStatusFun( false );
            }
            else{
                hotspotStatusFun( true );
                menuStatusFun( false );
                rulerStatusFun( false );
                qrcodeStatusFun( false );
            }
        });

        //二维码打开关闭
        $(".btn_group").on("mouseenter",".code_btn",function(){
            qrcodeStatusFun( true );
        });
        $(".btn_group").on("mouseleave",".code_btn",function(){
            qrcodeStatusFun( false );
        });

        //测量打开关闭
        $(".btn_group").on("click",".measure_btn",function(){
            if( $(this).hasClass("active") ){
                rulerStatusFun( false );
            }
            else{
                rulerStatusFun( true );
                menuStatusFun( false );
                hotspotStatusFun( false );
                qrcodeStatusFun( false );
            }
        });

        //背景切换
        $(".backimg_ul").on("click","li",function(){
            var status = $(this).attr("value");

            if( $(this).hasClass("active") ){
                return false
            }
            else {
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
                iframe.contentWindow.setBackgroundColor( setThreedBgUrl ( parseInt( status ) ) );
                setScreenClass ( status );
            }
        });

        //复位
        $(".reset_btn").on("click",function(){
            iframe.contentWindow.resetCamera();
            hotspotStatusFun( true );
            menuStatusFun( false );
            qrcodeStatusFun( false );
            rulerStatusFun( false );
        });

        //坐标切换
        $(".measure_group").on("click",">li",function(){
            $(this).addClass('active').siblings().removeClass('active');

            var _status = $(this).attr("status");
            if( _status == "y"){
                _status="z";
            }
            else if( _status == "z" ){
                _status="y";
            }
            iframe.contentWindow.showRuler( _status );
        });
    };
    //详情状态
    var menuStatusFun = function( flag ){
        var $cultural_relics_div = $(".cultural_relics_div");
        if( flag ){
            $cultural_relics_div.addClass("active").animate({"right": "0px"},200,"linear");
            discribleScroll();
        }
        else{
            if( $cultural_relics_div.hasClass("active") ){
                var detail_w = $cultural_relics_div.outerWidth(true);
                $cultural_relics_div.animate({"right": -detail_w+"px"},200,"linear");

                setTimeout(function () {
                    $cultural_relics_div.removeClass("active");
                },200);
            }
        }
    };

    //详情描述尺寸进行修改
    var discribleScroll = function(){
        var $cultural_relics_div = $(".cultural_relics_div");

        var window_h = $(window).innerHeight();
        var top_h    = $cultural_relics_div.find(".cultural_relics_title").innerHeight();
        var header_h = $cultural_relics_div.find(".center_main").innerHeight();
        var discribletitle_h = $cultural_relics_div.find(".discrible_title").innerHeight();

        var init_h = parseInt( window_h )- parseInt( top_h )- parseInt( header_h )- parseInt( discribletitle_h ) - 40;
        var discrible_h = parseInt( $cultural_relics_div.find(".discrible_center").outerHeight(true) );
        if( discrible_h > init_h ){
            var $discrible = $cultural_relics_div.find(".discrible_center");

            $discrible.css({"height": init_h+"px","overflow-y":"scroll","padding-right":"5px"});
        }
    };


    //热点状态
    var hotspotStatusFun = function( flag ){
        var $hotspot_btn = $(".btn_group .hotspot_btn");

        iframe.contentWindow.hotSpot_showDiv( flag );
        var $hotSpot_li = $("#iframe").contents().find(".hotSpot_ul >li");
        //打开
        if( flag &&  $hotSpot_li.length > 0  ){
            $hotspot_btn.addClass("active");
            $("#iframe").contents().find(".hotSpot_ul").css({"display":"block"});
        }
        //关闭
        else if ( !flag  &&  $hotSpot_li.length > 0  ){
            $hotspot_btn.removeClass("active");
            $("#iframe").contents().find(".hotSpot_ul").css({"display":"none"});
        }

        for( var i=0 ; i < $hotSpot_li.length ; i++ ){
            if( $hotSpot_li.eq(i).hasClass("active") ){
                $hotSpot_li.eq(i).removeClass("active");
            }
        }
    };

    //二维码状态
    var qrcodeStatusFun = function( flag ){
        var $qrcode = $(".qrcode_div");
        if( flag ){
            $qrcode.addClass("active");
        }
        else{
            $qrcode.removeClass("active");
        }
    };

    //测量状态
    var rulerStatusFun = function( flag ){
        var measure_btn = $(".btn_group .measure_btn");

        //打开测量
        if( flag ){
            measure_btn.addClass("active");

            iframe.contentWindow.showRuler("x");
            $(".measure_group").css({"display":"block"});
        }
        else{
            measure_btn.removeClass("active");

            iframe.contentWindow.hideRuler();
            $(".measure_group").css({"display":"none"});
            $(".measure_group").find("li").removeClass('active');
            $(".measure_group").find("li").eq(0).addClass('active');
        }
    };


    return {
        init: function() {
            initPage();
            operationFun();

            $(window).resize(function(){
                discribleScroll();
            });
        }
    };
}();

jQuery(document).ready(function() {
    Inpage.init();
});