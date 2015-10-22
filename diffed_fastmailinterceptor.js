// ==UserScript==
// @name         Fastmail Interceptor2
// @namespace    http://cepp.at/projects/PGE
// @version      0.1
// @description  Pretty Good Email -- A Pretty Good Email Encryptor based on Pretty Good Protction (PGP).
// @author       Put some names that sound important here.
// @match        https://www.fastmail.com/*
// @grant        none
// ==/UserScript==

//This gets us the permission to do cross site scritping and to be able to call the proper APIs (mainly those from Keybase).
chrome.permissions.request({
  permissions: [
    "https://*.keybase.io",
    "http://*.keybase.io",
    "http://keybase.io"
  ]
});

/*Tampermonkey is claiming that this, the above, will throw an error but the Chrome Extension will require this to allow cross site scripting. */

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

var transform = function(data) {
  var resp = JSON.parse(data);
  for (var i = resp.length; i--;) {
    if (resp[i][0] === "messageDetails") {
      var detailsList = resp[i][1].detailsList;
      for (var j = detailsList.length; j--;) {
        detailsList[j].body = decrypt(detailsList[j].body);
      }
    }
  }
  return JSON.stringify(resp);
};

//Everything up to here works most certainly.

var decrypt = function(s) {
}
//This is older code that handles the window sourcing.
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
