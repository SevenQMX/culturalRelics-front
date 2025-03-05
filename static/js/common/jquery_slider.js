!function ($) {
    //默认参数
    var timer ;
    var Slider = function(ele, opt) {
        this.$element = ele;
        this.$sliderBtnUl = $('<ul/>', { 'class': "slider_btn_group"});
        //可修改参数
        this.defaults = {
            "interval":3,   //滚动时间（单位：秒）
            "screenResize":true,  //滚动是否因屏幕大小变化而变化
            "hover" :true,  //是否出现hover暂停滚动
            "buttonClick":true, //小按钮点击切换图片
            "arrow" :false,    //隐藏左右箭头
            "btnGroup":"bottom"  //bottom left right   3个值
        };
        this.options  = $.extend({}, this.defaults, opt );
        this.sliderStart = 1;  //第一张图片开始滚动
        this.sliderIndex = 1;  //图片下标为1
        this.sliderLen   = ele.find("li").length;
    };

    Slider.prototype = {
        init: function(){
            var _this  = this,
                _$this = this.$element,
                _$banner = _$this.parent();

            //创建播放按钮
            _this.showSlider();
            _this.screenSize();
            _this.creatBtnGroup();
            _this.play();

            //hover暂停切换图片
            if( _this.options.hover ){
                _$banner.hover( function () {
                    //停止播放
                    _this.stop();
                } , function () {
                    //播放
                    _this.play();
                } );
            }
            //按钮点击切换图片
            if( _this.options.buttonClick ){
                var buttons = _this.$sliderBtnUl.find("li");
                buttons.on('click', function () {
                    var btnIndex = parseInt( $(this).attr('indexId') );
                    _this.sliderIndex = btnIndex;
                    //切换按钮
                    _this.showBut();
                    //切换图片
                    var _offsetLeft = -(btnIndex * _$banner.width());
                    _$this.animate({'margin-left': _offsetLeft+"px"}, 300);
                });
            }
            //屏幕大小变化
            if( _this.options.screenResize ){
                window.onresize = function(){
                    //图片大小设置
                    _this.screenSize();
                };
            }
            //左右切换箭头
            if( _this.options.arrow ){

            }
        },
        play : function () {
            var _this  = this;
            //按时执行
            timer = setTimeout(function () {
                _this.autoPlay();
                _this.play();

            },  _this.options.interval*1000 );
        },
        creatBtnGroup : function () {
            var _this  = this,
                _$this = this.$element,
                _$banner = _$this.parent();

            //创建播放按钮个数
            _$this.after( _this.$sliderBtnUl );
            for(var i = 0 ; i<_this.sliderLen ; i++){
                _this.$sliderBtnUl.append("<li indexId='"+(i+1)+"'></li>");
            }
            //播放按钮第一个添加class
            _this.$sliderBtnUl.find("li").eq(0).addClass("active");

            //播放按钮位置
            _$banner.css({"position":"relative"});
            _$this.css({
                "position":"absolute",
                "top":"0",
                "left":"0"
            });
            _this.$sliderBtnUl.css({"position":"absolute"});
            _this.$sliderBtnUl.find("li").css({
                "display":"block",
                "list-style-type": "none",
                "cursor":"pointer"
            });

            var _sliderBtnUl_w = _this.$sliderBtnUl[0].offsetWidth;
            var _sliderBtnUl_h = _this.$sliderBtnUl[0].offsetHeight;
            if( _this.options.btnGroup == "bottom"){
                _this.$sliderBtnUl.css({
                    "bottom": "10px",
                    "left":"50%",
                    "margin-left": "-"+_sliderBtnUl_w/2+"px"
                });
                _this.$sliderBtnUl.find("li").css({
                    "float": "left",
                    "margin-right":"10px"
                });
                _this.$sliderBtnUl.find("li").eq( _this.sliderLen-1 ).css({
                    "margin-right":"0px"
                });
            }
            else if( _this.options.btnGroup == "left"){
                _this.$sliderBtnUl.css({
                    "left": "10px",
                    "top":"50%",
                    "margin-top": "-"+_sliderBtnUl_h/2+"px"
                });
                _this.$sliderBtnUl.find("li").css({
                    "margin-bottom":"10px"
                });
                _this.$sliderBtnUl.find("li").eq( _this.sliderLen-1 ).css({
                    "margin-bottom":"0px"
                });
            }
            else if( _this.options.btnGroup == "right"){
                _this.$sliderBtnUl.css({
                    "right": "10px",
                    "top":"50%",
                    "margin-top": "-"+_sliderBtnUl_h/2+"px"
                });
                _this.$sliderBtnUl.find("li").css({
                    "margin-bottom":"10px"
                });
                _this.$sliderBtnUl.find("li").eq( _this.sliderLen-1 ).css({
                    "margin-bottom":"0px"
                });
            }
        },
        showSlider:function () {
            var _this  = this,
                _$this = this.$element,
                _$banner = _$this.parent();


            //ul前添加最后一张图片，ul后添加第一张图片
            var _first_img = _$this.find("li").eq(0);
            var _last_img  = _$this.find("li").eq(_this.sliderLen-1);
            _$this.prepend( _last_img.clone() );
            _$this.append( _first_img.clone() );
        },
        screenSize:function () {
            var _this  = this,
                _$this = this.$element,
                _$banner = _$this.parent();

            var _banner_w = _$banner[0].offsetWidth;
            var _sliderIndex = _this.sliderIndex;

            _$this.find("li").css({"width": _banner_w+"px"});
            _$this.css({"width": (_this.sliderLen+2)*_banner_w+"px","margin-left": "-"+(_banner_w*_sliderIndex)+"px"});
        },
        animate:function () {
            var _this  = this,
                _$this = this.$element,
                _$banner = _$this.parent();

            var _banner_w = _$banner.width();
            var _sliderIndex = _this.sliderLen+2;

            _$this.find("li").css({"width": _banner_w+"px"});
            _$this.css({"width": (_banner_w*_sliderIndex)+"px"});


            var _offsetLeft = -_$banner.width();
            var _newoff = _offsetLeft * _this.sliderIndex;

            var _left = parseInt( _$this.css('margin-left')) + _offsetLeft;

            _$this.animate({'margin-left': _newoff+"px"}, 300, function () {
                //最后一张图片时候，ul重新设置到第一轮界面去
                if ( _left < ( -_$banner.width() * _this.sliderLen)) {
                    _$this.css('margin-left', -_$banner.width());
                }
            });
        },
        autoPlay : function () {
            var _this  = this;

            //默认下标修改
            if ( _this.sliderIndex == _this.sliderLen ) {
                _this.sliderIndex = _this.sliderStart;
            }
            else {
                _this.sliderIndex += 1;
            }

            _this.animate();
            _this.showBut();
        },
        showBut:function () {
            var _this  = this;
            //按钮切换
            _this.$sliderBtnUl.find("li").eq( _this.sliderIndex - 1).addClass('active').siblings().removeClass('active');
        },
        stop : function () {
            clearTimeout( timer );
        }
    };

    $.fn.creatSlider = function(options) {
        var slider = new Slider( this, options );
        return slider.init();
    }
}(window.jQuery);