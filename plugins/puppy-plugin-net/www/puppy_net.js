/**
 * Created by cdtangchao on 2015/9/15.
 */
var exec = require('cordova/exec'),
    cordova = require('cordova');

function PuppyNet() {
    this.defaultOptions = {
        type: 'POST',
        url: '',
        data: '',
        dataType: 'json',
        success: null,
        error: null
    };

    this.options = null;
}

PuppyNet.prototype.ajax = function (options) {
    var _this = this;

    try {
        _this.options = _this._paraParse(options, _this.defaultOptions);

        if (_this.options.url == '') {
            console.log('url can not be empty');
        }
        else if (!/^http:/.test(_this.options.url)) {
            _this.options.url = 'http://' + _this.options.url;
        }

        if (_this.options.data != '' && typeof(_this.options.data) == 'object') {
            var dataStr = [];

            for (var index in _this.options.data) {
                dataStr.push(index + '=' + _this.options.data[index]);
            }

            _this.options.data = dataStr.join('&');
        }
    }
    catch (ex) {
        alert(ex);
    }

    exec(function (data) {
        var resultData;

        if (_this.options.dataType == 'json') {
            try {
                resultData = JSON.parse(data);
            }
            catch (ex) {
                _this._error('json format error');
            }
        }
        else {
            resultData = data;
        }

        _this.options.success.apply(null, [resultData]);
    }, function (error) {
        _this._error(error);
    }, 'PuppyNet', 'ajax', [_this.options.type, _this.options.url, _this.options.data]);
};

PuppyNet.prototype._paraParse = function (options, defaults) {
    var _o = options || {};
    var _defaults = defaults || {};
    for (var key in _defaults) {
        _o[key] = _o.hasOwnProperty(key) ? _o[key] : _defaults[key];
    }
    return _o;
};

PuppyNet.prototype._success = function (data) {
    if (this.options.success &&
        typeof(this.options.success) == 'function') {
        this.options.success.apply(null, [data]);
    }
};

PuppyNet.prototype._error = function (error) {
    if (this.options.error &&
        typeof(this.options.error) == 'function') {
        this.options.error.apply(null, [error]);
    }
};

module.exports = new PuppyNet();