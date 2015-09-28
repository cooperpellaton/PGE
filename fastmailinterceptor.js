// ==UserScript==
// @name         Fastmail Interceptor
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.fastmail.com/*
// @grant        none
// ==/UserScript==
"permissions": [
  "https://*.keybase.io",
  "http://*.keybase.io",
  "http://keybase.io"
]
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

//Components.utils.import("resource://app/window.openpgp");

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

var decrypt = function(s) {
    var openpgp = require('openpgp');

    var options = {
      numBits: 2048,
      userId: 'Jon Smith <jon.smith@example.org>',
      passphrase: 'super long and hard to guess secret'
    };

    openpgp.generateKeyPair(options).then(function(keypair) {
      // success
      var privkey = keypair.privateKeyArmored;
      var pubkey = keypair.publicKeyArmored;
    }).catch(function(error) {
      // failure
    });

    var keypair = openpgp.generateKeyPair(1, 1024, "testUser");
    var privKeys = openpgp.key.readArmored(keypair.privateKeyArmored);
    var publicKeys = openpgp.key.readArmored(keypair.publicKeyArmored);
    var privKey = privKeys.keys[0];
    var pubKey = publicKeys.keys[0];
    privKey.decrypt();
    var clearSignedArmor = openpgp.signClearMessage(privKey, "test text");
    console.log("clearSignedArmor " + clearSignedArmor);
    console.log("verify " + openpgp.verifyClearSignedMessage([pubKey], clearSignedArmor));

    /*var options = {
      numBits: 2048,
      function generateTrueUser = (user) {
        var keybaseCaller = new XMLHttpRequest();
        keybaseCaller("GET", chrome.extension.getURL('https://keybase.io/_/api/1.0/user/lookup.json' + 'user'), true);
        keybaseCaller.onreadystatechange = function(){
        if (keybaseCaller.readyState == 4){
        var resp = JSON.parse(keybaseCaller.responseText);
      }
      }
        keybaseCaller.send();
        )
        var actualUser = them.username;
      }
      userId: actualUser,
      passphrase: password,
    };
*/

    //Decrypting the body.
    var openpgp = require('openpgp');
    var key = '-----BEGIN PGP PRIVATE KEY BLOCK ... END PGP PRIVATE KEY BLOCK-----';
    var privateKey = openpgp.key.readArmored(key).keys[0];
    privateKey.decrypt('passphrase');

    var pgpMessage = '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----';
    pgpMessage = openpgp.message.readArmored(pgpMessage);

    return openpgp.decryptMessage(privateKey, pgpMessage).then(function(plaintext) {
      // success
    }).catch(function(error) {
      // failure
    });
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
