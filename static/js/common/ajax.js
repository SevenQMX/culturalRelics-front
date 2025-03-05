
/**
 * ajax封装
 * url 发送请求的地址
 * data 发送到服务器的数据，数组存储
 * succCallback 成功回调函数
 * errorCallback 失败回调函数
 * type 请求方式("POST" 或 "GET")， 默认已经设置为 "POST"
 * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
 */
var $ajax = function (url, postData, callback, type, dataType, contentType, processData) {
    var _type = type || "GET";
    var _dataType = dataType || "json";
    var _contentType, _processData;
    if (contentType == "file") {
        _contentType = false
    }
    else {
        _contentType = "application/x-www-form-urlencoded"
    }

    if (processData == "file") {
        _processData = false
    }
    else {
        _processData = true
    }

    $.ajax({
        dataType: _dataType,
        type: _type,
        url: url,
        data: postData,
        cache: false,
        contentType: _contentType,
        processData: _processData,
        beforeSend: function () {
            $(".culturalrelic_error").removeClass("hide").addClass("show").html("<i class='icon icon_loading_gray'></i><span>正在加载中...</span>");
        },
        success: function (res) {
            if (callback) {
                callback(res);
            }
        },
        error: function (err) { },
        complete: function () {
            $(".culturalrelic_error").removeClass("show").addClass("hide").html("");
        }
    });
};
