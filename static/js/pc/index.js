/**
 * Created by Administrator on 2017/12/19.
 */
var Inpage = function () {
    var _csrf_name = $('meta[name="csrf-param"]').attr("content");
    var _csrf_token = $('meta[name="csrf-token"]').attr("content");

    //搜索栏
    var initSearchLine = function () {
        var _url = "../../json/tag_list_view.json";
        var _data = {};
        _data[_csrf_name] = _csrf_token;

        $ajax(_url, _data, function (data) {
            var datas = data.data.items;

            var optgroup3 = '', optgroup5 = '';
            $.each(datas, function (index, value) {
                var types = '';
                switch (value.type) {
                    case 1:
                        types = '年代';
                        break;
                    case 2:
                        types = '材质';
                        break;
                    case 4:
                        types = '级别';
                        break;
                    case 6:
                        types = '出处';
                        break;
                    default:
                        types = '类型';
                }

                var select = '';
                var option = '<option value="0">' + types + '</option>';

                if (value.type == 3 || value.type == 5) {
                    $.each(value.tag, function (ind, val) {
                        if (value.type == 3) {
                            optgroup3 += '<option value="' + val.id + '">' + val.name + '</option>';
                        }
                        else {
                            optgroup5 += '<option value="' + val.id + '">' + val.name + '</option>';
                        }
                    });

                    if (value.type == 5) {
                        select += '<select type="' + value.type + '" class="form-control size_x_xxxxl select_dom"  data-size="5"  name="tag_select"  data-required="1">' +
                            option +
                            '<optgroup label="可移动文物" type="3">' + optgroup3 + '</optgroup>' +
                            '<optgroup label="不可移动文物" type="5">' + optgroup5 + '</optgroup>' +
                            '</select>';
                    }
                }
                else {
                    $.each(value.tag, function (ind, val) {
                        option += '<option value="' + val.id + '">' + val.name + '</option>';
                    });

                    select += '<select type="' + value.type + '" ' +
                        'class="selectpicker dropdown show-tick show-menu-arrow select_dom" data-size="5" >' + option + '</select>';
                }
                $(".tab_left_div.float_l").append(select);
                $(".tab_left_div.float_l select").selectpicker('refresh');
            });
        });
    };
    //页面数据加载
    var initPage = function () {
        var _page = 1;
        var _url = '../../json/relics_list.json';
        var _data = { "page": _page };
        _data[_csrf_name] = _csrf_token;

        $ajax(_url, _data, function (data) {
            $("html,body").animate({ "scrollTop": "0" });
            $(".culturalrelic_list").empty();

            listFun(data, _page);

            var _total_count = data.data.total_count;
            var _limit = data.data.limit;
            if ($.isEmptyObject(data.data.items)) {
                _total_count = 1;
                _limit = 10;
            }
            layui.use('laypage', function () {
                layui.laypage.render({
                    elem: 'culturalrelic_pagination',
                    count: _total_count,
                    limit: _limit,
                    prev: " ",
                    next: " ",
                    jump: function (obj, first) {
                        if (!first) {
                            changePage(obj.curr);
                        }
                    }
                });
            });
        });
    };
    //操作
    var operationFun = function () {
        //轮播图
        var $banner_slider = $(".banner_slider");
        if ($banner_slider.find(".slide").length > 1) {
            $banner_slider.creatSlider({
                "interval": 5,
                "hover": false
            });
        }

        //置顶
        $.scrollUp({
            scrollName: 'scrollUp',
            topDistance: 200,
            topSpeed: 300,
            animation: 'fade',
            animationInSpeed: 200,
            animationOutSpeed: 200,
            scrollText: '',
            activeOverlay: false
        });
        //搜索
        $(".tab_right_div").on('click', ".icon-search", function () {
            var header_top = $("header").innerHeight();
            $("html,body").animate({ scrollTop: header_top + "px" }, 500);

            searchFun();
        });
        //选择框
        $(".tab_left_div").on('changed.bs.select', " div.select_dom", function () {
            var header_top = $("header").innerHeight();
            $("html,body").animate({ scrollTop: header_top + "px" }, 500);

            searchFun();
        });
        //查看文物
        $(".culturalrelic_div .culturalrelic_list").on('click', "li", function (e) {
            var goods_id = $(this).attr("goods_id");
            window.open("cultural-relics.html?id=" + goods_id);
        });
    };
    //搜索传数据
    var searchFun = function (page) {
        var searchVal = $(".search_div .search_input").val();
        var $select = $(".tab_left_div").find("select");
        var arr = [];
        for (var i = 0; i < $select.length; i++) {
            var iptionId = parseInt($select.eq(i).find("option:selected").attr("value"));
            if (iptionId) {
                arr.push(iptionId);
            }
        }

        var _url = '../../json/relics_list2.json';
        var _page = 1;
        if (page) {
            _page = page;
        }
        var _data = { "page": _page };
        _data[_csrf_name] = _csrf_token;
        if (searchVal) {
            _data.name = searchVal;
        }
        if (Boolean(arr.length)) {
            _data.tag = arr;
        }

        $ajax(_url, _data, function (data) {
            $(".culturalrelic_list").empty();

            listFun(data, _page);

            var _total_count = data.data.total_count;
            var _limit = data.data.limit;
            if ($.isEmptyObject(data.data.items)) {
                _total_count = 1;
                _limit = 10;
            }
            layui.use('laypage', function () {
                layui.laypage.render({
                    elem: 'culturalrelic_pagination',
                    count: _total_count,
                    limit: _limit,
                    prev: " ",
                    next: " ",
                    jump: function (obj, first) {
                        if (!first) {
                            changePage(obj.curr);
                        }
                    }
                });
            });
        });
    };
    //页面加载数据
    var listFun = function (data) {
        //访问量
        $(".footer_right_div .view_amount_ul").empty();
        var view_amount = "" + data.data.view_amount;
        for (var i = 0; i < view_amount.length; i++) {
            var number = "<li>" + view_amount.substring(i, i + 1) + "</li>";
            $(".footer_right_div .view_amount_ul").append(number);
        }

        //内容
        if (!$.isEmptyObject(data.data.items)) {
            $.each(data.data.items, function (index, value) {
                var date = '';
                $.each(value.tag, function (ind, tag) {
                    if (tag.type == 1) {
                        date = tag.name
                    }
                });

                var li = '<li class="cultural_li" goods_id="' + value.goods_id + '">' +
                    '<div class="li_img">' +
                    '<div class="img_div" style="background: url(' + value.ViewImgUrl + ');background-size: cover;background-position: 50% 50%;"></div>' +
                    //'<img src="'+ value.ViewImgUrl +'" alt="">' +
                    '<div class="li_img_cover"></div>' +
                    '</div>' +
                    '<div class="li_info">' +
                    '<span class="info_title">' + strlen(value.title, 30) + '</span>' +
                    '<span class="info_date">' + strlen(date, 34) + '</span>' +
                    '</div>' +
                    '</li>';
                $(".culturalrelic_list").append(li);
            });

            for (var i = 1; i <= $(".culturalrelic_list li").length; i++) {
                if (i % 4 == 0) {
                    $(".culturalrelic_list li").eq(i - 1).css({ "margin-right": "0" });
                }
            }
        }
        else {
            $(".culturalrelic_list").html("<div>[暂无数据]</div>");
        }
        screen();
    };
    //翻页
    var changePage = function (page) {
        var header_top = $("header").innerHeight();
        $("html,body").animate({ scrollTop: header_top + "px" }, 500);

        var searchVal = $(".search_div .search_input").val();
        var $select = $(".tab_left_div").find("select");
        var arr = [];
        for (var i = 0; i < $select.length; i++) {
            var iptionId = parseInt($select.eq(i).find("option:selected").attr("value"));
            if (iptionId) {
                arr.push(iptionId);
            }
        }

        var _url = '../../json/relics_list2.json';
        var _data = { "page": page };
        _data[_csrf_name] = _csrf_token;
        if (searchVal) {
            _data.name = searchVal;
        }
        if (Boolean(arr.length)) {
            _data.tag = arr;
        }

        $ajax(_url, _data, function (data) {
            $(".culturalrelic_list").empty();

            listFun(data);

            if ($.isEmptyObject(data.data.items)) {
                layui.use('laypage', function () {
                    layui.laypage.render({
                        elem: 'culturalrelic_pagination',
                        count: 1,
                        prev: " ",
                        next: " "
                    });
                });
            }
        });
    };

    return {
        init: function () {

            initSearchLine();
            initPage();
            operationFun();
        }
    };
}();

jQuery(document).ready(function () {
    Inpage.init();
});
