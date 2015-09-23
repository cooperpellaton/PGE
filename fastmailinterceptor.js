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
    console.log(arguments);
    var request = new oldXMLHttpRequest();
    var facade = {
        addEventListener: function(type, listener) {
            return request.addEventListener(type, listener);
        },
        setRequestHeader: function() {
            return request.setRequestHeader.apply(request, arguments);
        },
        getAllResponseHeaders: function() {
            return request.getAllResponseHeaders.apply(request,
                                                       arguments);
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
            request.onreadystatechange = function() {
                if (request.readyState = 4) {
                    console.log(facade.__url);
                    console.log(request.response);

                    facade.status = request.status;
                    facade.response = request.response;
                    facade.responseType = request.responseType;

                }
                if (facade.onreadystatechange) {
                    facade.onreadystatechange();
                }
            };
            return request.send(data);
        }
    };
    return facade;
};


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
