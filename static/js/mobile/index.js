/**
 * Created by Administrator on 2017/12/19.
 */
var Inpage = function() {
    var _csrf_name  = $('meta[name="csrf-param"]').attr("content");
    var _csrf_token = $('meta[name="csrf-token"]').attr("content");

    //搜索栏
    var initSearchLine = function(){
        var _url  = "../../json/tag_list_view.json";
        var _data = {};
        _data[_csrf_name] = _csrf_token;

        $ajax( _url , _data ,function( data ){
            var datas = data.data.items;

            var optgroup3 = '' ,  optgroup5 = '' ;
            $.each( datas , function( index , value ){
                var types = '';
                switch(value.type) {
                    case 1:
                        types  = '年代';
                        break;
                    case 2:
                        types  = '材质';
                        break;
                    case 4:
                        types  = '级别';
                        break;
                    case 6:
                        types  = '出处';
                        break;
                    default:
                        types  = '类型';
                }

                var select = '';
                var option = '<option value="0">'+ types +'</option>';

                if( value.type == 3 ||  value.type == 5){
                    $.each( value.tag , function( ind , val ){
                        if( value.type == 3){
                            optgroup3 += '<option value="'+val.id+'">'+val.name+'</option>';
                        }
                        else {
                            optgroup5 += '<option value="'+val.id+'">'+val.name+'</option>';
                        }
                    });

                    if( value.type == 5 ){
                        select += '<select type="'+value.type+'" class="form-control size_x_xxxxl"  data-size="5"  name="tag_select"  data-required="1">' +
                            option +
                            '<optgroup label="可移动文物" type="3">'+optgroup3+'</optgroup>' +
                            '<optgroup label="不可移动文物" type="5">'+optgroup5+'</optgroup>' +
                            '</select>';
                    }
                }
                else {
                    $.each( value.tag , function( ind , val ){
                        option += '<option value="'+val.id+'">'+val.name+'</option>';
                    });

                    select += '<select type="'+value.type+'" ' +
                        'class="selectpicker dropdown show-tick show-menu-arrow select_dom" data-size="5" >' + option + '</select>';
                }
                $(".tab_div .contain_div").append( select );
                $(".tab_div .contain_div select").selectpicker('refresh');
            });
        });
    };
    //页面数据加载
    var initPage = function () {
        var _url  = '../../json/relics_list.json';
        var _page = 1;
        var _data = {"page": _page};
        _data[_csrf_name] = _csrf_token;

        $ajax ( _url, _data , function( data ){
            $(".culturalrelic_list").empty();
            listFun( data , _page );
        } );

    };
    //操作
    var operationFun = function () {
        //分页
        $(window).scroll(function() {
            var header_h = 0 ,
                footer_h = 0,
                secContain_h = 0;

            $("section>div").each( function(){
                secContain_h += $(this).outerHeight(true);
            });

            if( $("body").find('header').length > 0 || $("body").find('footer').length > 0 ){
                if( $("body").find('header').length > 0 ){
                    header_h = $("header").outerHeight(true);
                }
                if( $("body").find('footer').length > 0 ){
                    footer_h = $("footer").outerHeight(true);
                }
            }
            var $this = $(this),
                viewH = $this.innerHeight(),
                contentH  = header_h + secContain_h + footer_h,
                scrollTop = $this.scrollTop();

            if( scrollTop  == (contentH - viewH ) ){
                var _page  = parseInt( $(".culturalrelic_list").attr("page_id") ) ;

                if( _page > 0 ){
                    _page = _page+1;

                    var _url  = '../../json/relics_list'+_page+'.json';
                    var _data = {"page": _page };
                    _data[_csrf_name] = _csrf_token;

                    //添加搜索数据
                    var searchVal = $(".search_div .search_input").val();
                    var $select   = $(".tab_div").find("select");
                    var arr = [];
                    for( var i=0 ; i < $select.length ; i++){
                        var iptionId = parseInt( $select.eq(i).find("option:selected").attr("value") );
                        if( iptionId ){
                            arr.push( iptionId );
                        }
                    }
                    if( searchVal ){
                        _data.name = searchVal;
                    }
                    if( Boolean(arr.length) ){
                        _data.tag  = arr;
                    }

                    $ajax ( _url, _data , function( data ){
                        listFun( data , _page );
                    } );
                }
            }
        });
        //置顶
        $.scrollUp({
            scrollName: 'scrollUp',
            topDistance: 200 ,
            topSpeed: 300,
            animation: 'fade',
            animationInSpeed: 200,
            animationOutSpeed: 200,
            scrollText: '',
            activeOverlay: false
        });
        //搜索
        $(".banner").on('click',".icon-search",function() {
            searchFun();
        });
        $(".tab_div").on('changed.bs.select',"div.select_dom",function() {
            searchFun();
        });
        //查看文物
        $(".culturalrelic_div .culturalrelic_list").on('click',"li",function(e) {
            var goods_id = $(this).attr("goods_id");
            //var scrollTop = $(window).scrollTop();
            window.location.href = "cultural-relics.html?id="+goods_id;
        });
    };
    //搜索传数据
    var searchFun = function () {

        if( !$(".banner").hasClass("search")){
            $(".banner").addClass("search");
        }

        var searchVal = $(".search_div .search_input").val();
        var $select   = $(".tab_div").find("select");
        var arr = [];
        for( var i = 0 ; i < $select.length ; i++){
            var iptionId = parseInt( $select.eq(i).find("option:selected").attr("value") );
            if( iptionId ){
                arr.push( iptionId );
            }
        }

        var _url   = '../../json/relics_list3.json';
        var _page  = 1;
        var _data  = {"page": _page};
        _data[_csrf_name] = _csrf_token;
        if( searchVal ){
            _data.name = searchVal;
        }
        if( Boolean(arr.length) ){
            _data.tag  = arr;
        }

        $ajax( _url , _data ,function( data ){

            $(".culturalrelic_list").empty();

            listFun( data , _page );
        });
    };
    //页面加载数据
    var listFun = function ( data , page ) {
        //访问量
        $(".footer_div .view_amount_ul").empty();
        var view_amount = ""+data.data.view_amount;
        for( var i = 0 ; i <view_amount.length ; i++ ){
            var number = "<li>"+view_amount.substring(i,i+1)+"</li>";
            $(".footer_div .view_amount_ul").append( number );
        }

        //内容
        if( !$.isEmptyObject(data.data.items) ){
            $(".culturalrelic_error").removeClass("show").addClass("hide").html("");
            $(".culturalrelic_list").attr({"page_id":page});

            $.each(  data.data.items , function (index , value ) {
                var date = '';
                $.each( value.tag , function ( ind , tag ) {
                    if( tag.type == 1 ){
                        date = tag.name
                    }
                });

                var date_len  = 0,
                    title_len = 0;
                var window_w  = $(window).outerWidth(true);

                if( window_w <= 330 ){
                    title_len = 16;
                    date_len  = 20 ;
                }
                else if( (331 <= window_w) && (window_w <= 479) ){
                    title_len = 16;
                    date_len  = 20 ;
                }
                else{
                    title_len = 40;
                    date_len  = 40 ;
                }

                var li = '<li class="cultural_li" goods_id="'+ value.goods_id +'">' +
                    '<div class="li_img">' +
                    '<img src="'+ value.ViewImgUrl +'" alt="">' +
                    '<div class="li_img_cover"></div>' +
                    '</div>' +
                    '<div class="li_info">' +
                    '<span class="info_title">'+ strlen( value.title , title_len) +'</span>' +
                    '<span class="info_date">'+  strlen( date , date_len)+'</span>' +
                    '</div>' +
                    '</li>';
                $(".culturalrelic_list").append( li );
            });

            for(var i = 1;i <= $(".culturalrelic_list li").length ; i++ ){
                if( i%2 == 0 ){
                    $(".culturalrelic_list li").eq(i-1).css({"margin-right":"0"});
                }
            }
        }
        else {
            $(".culturalrelic_list").attr({"page_id":0});
            if( page == 1 ){
                $(".culturalrelic_error").removeClass("hide").addClass("show").html("[暂无数据]");
            }
            else {
                $(".culturalrelic_error").removeClass("hide").addClass("show").html("<i class='icon icon_loading_gray'></i><span>正在加载中 . . .</span>");
                setTimeout(function(){
                    $(".culturalrelic_error").removeClass("show").addClass("hide").html("");
                },5000)
            }
        }
        screen();
    };

    return {
        init: function() {
            initSearchLine();
            initPage();
            operationFun();
        }
    };
}();

jQuery(document).ready(function() {
    Inpage.init();
});
