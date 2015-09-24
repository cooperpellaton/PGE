// ==UserScript==
// @name         Fastmail Interceptor
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.fastmail.com/*
// @grant        none
// ==/UserScript==

var oldXMLHttpRequest = XMLHttpRequest;
XMLHttpRequest = function() {
    var request = new oldXMLHttpRequest();
    var facade = {
        addEventListener: function(type, listener) {
            return request.addEventListener(type, listener);
        },
        setRequestHeader: function() {
            return request.setRequestHeader.apply(request, arguments);
        },
        getAllResponseHeaders: function() {
            return request.getAllResponseHeaders.apply(request, arguments);
        },
        getResponseHeader: function() {
            return request.getResponseHeader.apply(request, arguments);
        },
        abort: function() {
            return request.abort.apply(request, arguments);
        },
        open: function(method, url, async, user, password) {
            facade.__url = url;
            request.open(method, url, async, user, password);
        },
        send: function(data) {
            request.onreadystatechange = function(event) {
                facade.readyState = request.readyState;
                facade.status = request.status;
//                facade.response = request.response;
                if (request.responseText) {
                    facade.responseText = transform(request.responseText);
                }
                facade.responseType = request.responseType;
                if (facade.onreadystatechange) {
                    return facade.onreadystatechange(event);
                }
            };
            return request.send(data);
        }
    };
    return facade;
};

Components.utils.import("reosource://app/window.openpgp");

$.getScript("encryptor.js", function()){
  alert("The encryption scheme has been loading but cannot be assumed to work at this point.")
}

var transform = function(data) {
    var resp = JSON.parse(data);
    for (var i = resp.length; i-- ;) {
        if (resp[i][0] === "messageDetails") {
            var detailsList = resp[i][1].detailsList;
            for (var j = detailsList.length; j-- ;) {
                detailsList[j].body = detailsList[j].body.replace(" ", );
                console.log(detailsList[j].body)
            }
        }
    }
    return JSON.stringify(resp);
}

/*
var oldWindowEventSource = window.EventSource;
window.EventSource = function(url) {
    console.log(url);
    var source = new oldWindowEventSource(url);
    return {
        addEventListener: function(n, f, b) {
            source.addEventListener(n, new function(e) {
                console.log(arguments);
            }, b);
        }
    };
};
*/
