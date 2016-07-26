
;(function () {
    if (window.H5Bridge) {
        return;
    }

    var CUSTOM_PROTOCOL_SCHEME = 'h5cmd';

    function init(messageHandler) {

    }

    function call(handlerName, data, responseCallback) {
        _doSend(handlerName, data, responseCallback);
    }

    function _doSend(command, data, responseCallback) {
        window.location = _getUrl(command, data, responseCallback);
    }
    
    function _getUrl(command, data, responseCallback) {
        var url = CUSTOM_PROTOCOL_SCHEME + '://' + command;

        if (data) {
            for (var key in data) {
                url += (url.indexOf('?') > -1) ? '&' : '?';
                url += key + '=' + data[key];
            }
        }

        if (responseCallback) {
            url += (url.indexOf('?') > -1) ? '&' : '?';
            url += 'cb=' + responseCallback;
        }

        return url;
    }

    window.H5Bridge = {
        init: init,
        call: call,
        url: _getUrl
    };

    var doc = document;
    var readyEvent = doc.createEvent('Events');
    readyEvent.initEvent('H5BridgeReady');
    readyEvent.bridge = H5Bridge;
    doc.dispatchEvent(readyEvent);
})();
