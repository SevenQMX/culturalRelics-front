var Inpage = function () {
    var _csrf_name = $('meta[name="csrf-param"]').attr("content");
    var _csrf_token = $('meta[name="csrf-token"]').attr("content");

    var initPage = function () {
        var _url = '../../json/cultural-relics.json';
        var _data = {};
        _data[_csrf_name] = _csrf_token;

        iframe.onload = function () {
            $ajax(_url, _data, function (data) {
                if (!$.isEmptyObject(data.data.items)) {
                    var datas = data.data.items;
                    console.log(datas)
                    //模型
                    iframe.contentWindow.loadModel(datas.GoodsObjFileUrl, datas.GoodsTextureFileUrl, datas.GoodsMtlFileUrl);
                    iframe.contentWindow.setCameraParam(datas.cameraoffset[0], datas.cameraoffset[1], datas.cameraoffset[2], datas.cameradistance);
                    iframe.contentWindow.setLightingScheme(datas.lighting);
                    iframe.contentWindow.setBackgroundColor(setThreedBgUrl(datas.backUrl));

                    $(".btn_group .hotspot_btn").addClass("active");
                    //iframe.contentWindow.setControlsDom( "hotSpot_div" );

                    $(".back_btn").attr("backid", datas.backUrl);
                    setScreenClass(datas.backUrl);

                    //热点
                    iframe.contentWindow.hotSpot_showDiv(true);
                    $.each(datas.hotspot, function (index, value) {
                        iframe.contentWindow.hotSpot_initDiv(value);
                    });

                    //模型热点添加
                    iframe.contentWindow.setModelStateCallback(function (event, param) {
                        iframe.contentWindow.hotSpot_process(event, param);

                        if (event == "loaded") {
                            $.each(datas.hotspot, function (index, value) {
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
                    iframe.contentWindow.setHotSpotScreenPosCallback(function (id, x, y, opacity) {
                        var $hotSpot_ul = $("#iframe").contents().find(".hotSpot_ul");
                        var $screen_w = $(window).innerWidth();

                        if (x > $screen_w) {
                            $hotSpot_ul.find("li[position_id='" + id + "']").css({ "display": "none" });
                        }
                        else {
                            if ($hotSpot_ul.find("li[position_id='" + id + "']").length > 0) {
                                $hotSpot_ul.find("li[position_id='" + id + "']").css({ "display": "block", "top": y + "px", "left": x + "px" }).animate({ opacity: 1 }, 200);
                                $hotSpot_ul.find("li[position_id='" + id + "'] .icon_hotspot_back").css({ "opacity": opacity });
                                $hotSpot_ul.find("li[position_id='" + id + "'] .icon_hotspot_circle").css({ "opacity": opacity });
                            }
                            else {
                                setTimeout(function () {
                                    if ($hotSpot_ul.find("li[position_id='" + id + "']").length > 0) {
                                        $hotSpot_ul.find("li[position_id='" + id + "']").css({ "display": "block", "top": y + "px", "left": x + "px" }).animate({ opacity: 1 }, 200);
                                        $hotSpot_ul.find("li[position_id='" + id + "'] .icon_hotspot_back").css({ "opacity": opacity });
                                        $hotSpot_ul.find("li[position_id='" + id + "'] .icon_hotspot_circle").css({ "opacity": opacity });
                                    }
                                }, "100");
                            }
                        }
                    });

                    //页面详情
                    var $info_div = $(".info_div");

                    $info_div.append('<span class="title">' + strlen(datas.title, 16) + '</span>');
                    $info_div.append('<span class="dates">' + strlen(datas.years_text, 8) + '</span>');
                    $info_div.append('<span class="tag">' + strlen(datas.material_text, 12) + '</span>');
                    $info_div.append('<span class="tag">' + strlen(datas.goods_type_text, 12) + '</span>');
                    $info_div.append('<span class="tag">' + strlen(datas.source_text, 12) + '</span>');

                    //模型详情
                    var $cultural_relics_div = $(".cultural_relics_center");
                    $cultural_relics_div.find(".center_title").html(datas.title);
                    $cultural_relics_div.find(".center_date").html(datas.years_text);
                    $cultural_relics_div.find("li[name='style'] span").html(datas.goods_type_text);
                    $cultural_relics_div.find("li[name='material'] span").html(datas.material_text);
                    $cultural_relics_div.find("li[name='source'] span").html(datas.source_text);
                    $cultural_relics_div.find("li[name='level'] span").html(datas.level_text);
                    $cultural_relics_div.find("li[name='purpose'] span").html(datas.purpose);
                    $cultural_relics_div.find("li[name='volume'] span").html(datas.goods_size);
                    $cultural_relics_div.find(".discrible_center").html(datas.describe);

                }
            });
        };
    };

    var operationFun = function () {
        //文物详情打开关闭
        $(".btn_group").on("click", ".menu_btn", function () {
            menuStatusFun(true);

            hotspotStatusFun(false);
            rulerStatusFun(false);
        });
        $(".cultural_relics_div").on("click", ".icon_remove", function () {
            menuStatusFun(false);
        });

        //热点打开关闭
        $(".btn_group").on("click", ".hotspot_btn", function () {
            if ($(this).hasClass("active")) {
                //iframe.contentWindow.setControlsDom( "canvas" );
                hotspotStatusFun(false);
            }
            else {
                //iframe.contentWindow.setControlsDom( "hotSpot_div" );
                hotspotStatusFun(true);

                menuStatusFun(false);
                rulerStatusFun(false);
                qrcodeStatusFun(false);
            }
        });

        //二维码打开关闭
        $(".btn_group").on("click", ".code_btn", function () {
            var $qrcode = $(".qrcode_div");
            if ($qrcode.hasClass("active")) {
                qrcodeStatusFun(false);
            }
            else {
                qrcodeStatusFun(true);
            }
        });

        //测量打开关闭
        $(".btn_group").on("click", ".measure_btn", function () {
            if ($(this).hasClass("active")) {
                rulerStatusFun(false);
            }
            else {
                //iframe.contentWindow.setControlsDom( "canvas" );
                rulerStatusFun(true);

                menuStatusFun(false);
                hotspotStatusFun(false);
                qrcodeStatusFun(false);
            }
        });

        //背景切换
        $(".btn_group").on("click", ".back_btn", function () {
            var backid = $(this).attr("backid");
            iframe.contentWindow.setBackgroundColor(setThreedBgUrl(mobileScreenFun(backid)));

            $(".back_btn").attr("backid", mobileScreenFun(backid));
            setScreenClass(mobileScreenFun(backid));
        });

        //复位
        $(".reset_div").on("click", function () {
            iframe.contentWindow.resetCamera();

            menuStatusFun(false);
            qrcodeStatusFun(false);
            rulerStatusFun(false);
        });

        //坐标切换
        $(".measure_group").on("click", ">li", function () {
            $(this).addClass('active').siblings().removeClass('active');

            var _status = $(this).attr("status");
            if (_status == "y") {
                _status = "z";
            }
            else if (_status == "z") {
                _status = "y";
            }
            iframe.contentWindow.showRuler(_status);
        });
    };
    //详情状态
    var menuStatusFun = function (flag) {
        var $cultural_relics_div = $(".cultural_relics_div");
        if (flag) {
            $cultural_relics_div.addClass("active").animate({ "right": "0px" }, 200, "linear");
            discribleScroll();
        }
        else {
            if ($cultural_relics_div.hasClass("active")) {
                var detail_w = $cultural_relics_div.outerWidth(true);
                $cultural_relics_div.animate({ "right": -detail_w + "px" }, 200, "linear");

                setTimeout(function () {
                    $cultural_relics_div.removeClass("active");
                }, 200);
            }
        }
    };
    var discribleScroll = function () {
        var $cultural_relics_div = $(".cultural_relics_div");

        var window_h = $(window).innerHeight();
        var header_h = $cultural_relics_div.find(".center_main").innerHeight();
        var discribletitle_h = $cultural_relics_div.find(".discrible_title").innerHeight();

        var init_h = parseInt(window_h) - parseInt(header_h) - parseInt(discribletitle_h) - 40;
        var discrible_h = parseInt($cultural_relics_div.find(".discrible_center").outerHeight(true));

        if (discrible_h > init_h) {
            var $discrible = $cultural_relics_div.find(".discrible_center");

            $discrible.css({ "height": init_h + "px", "overflow-y": "scroll", "padding-right": "5px" });
        }
    };

    //热点状态
    var hotspotStatusFun = function (flag) {
        var $hotspot_btn = $(".btn_group .hotspot_btn");

        iframe.contentWindow.hotSpot_showDiv(flag);
        if (flag) {
            //打开
            $hotspot_btn.addClass("active");
        }
        else {
            //关闭
            $hotspot_btn.removeClass("active");

            var $hotSpot_li = $("#iframe").contents().find(".hotSpot_ul >li");
            for (var i = 0; i < $hotSpot_li.length; i++) {
                if ($hotSpot_li.eq(i).hasClass("active")) {
                    $hotSpot_li.eq(i).removeClass("active");
                }
            }
        }
    };
    //二维码状态
    var qrcodeStatusFun = function (flag) {
        var $qrcode = $(".qrcode_div");
        if (flag) {
            $qrcode.addClass("active");
        }
        else {
            $qrcode.removeClass("active");
        }
    };
    //测量状态
    var rulerStatusFun = function (flag) {
        var measure_btn = $(".btn_group .measure_btn");

        if (flag) {
            measure_btn.addClass("active");

            iframe.contentWindow.showRuler("x");
            $(".measure_group").css({ "display": "block" });
        }
        else {
            measure_btn.removeClass("active");

            iframe.contentWindow.hideRuler();
            $(".measure_group").css({ "display": "none" });
            $(".measure_group").find("li").removeClass('active');
            $(".measure_group").find("li").eq(0).addClass('active');
        }
    };

    return {
        init: function () {
            initPage();
            operationFun();

            $(window).resize(function () {
                discribleScroll();
            });
        }
    };
}();

jQuery(document).ready(function () {
    Inpage.init();
});