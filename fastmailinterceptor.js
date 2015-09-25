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

Components.utils.import("resource://app/window.openpgp");

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
}

var decrypt = function(s) {
    var options = {
      numBits: 2048,
      function generateTrueUser = (user) {
        var userSearch = 'https://keybase.io/_/api/1.0/user/lookup.json' + user;
          Get userSearch;
        var actualUser = them.username;
      }
      userId: actualUser,
      passphrase: password,
    };

    if {
      function(Get userSearch === null) {
        openpgp.generateKeyPair(options).then(function(keypair) {
          // success
          var privkey = keypair.privateKeyArmored;
          var pubkey = keypair.publicKeyArmored;
        }).catch(function(error) {
          // failure
        });
      }
    } else {
      var pubkey = get UserSearch.public_keys;
    }
    var encryptionTester = function() {
        var contents = body.search("BEGIN PGP");
        if (contents = 0) {
          //Encrypting the body.
          var openpgp = require('openpgp');

          var key = '-----BEGIN PGP PUBLIC KEY BLOCK ... END PGP PUBLIC KEY BLOCK-----';
          var publicKey = openpgp.key.readArmored(key);

          openpgp.encryptMessage(publicKey.keys, 'Hello, World!').then(function(pgpMessage) {
            // success
          }).catch(function(error) {
            // failure
          });
        } else {
          //Decrypting the body.
          var openpgp = require('openpgp');
          return {
            var key = '-----BEGIN PGP PRIVATE KEY BLOCK ... END PGP PRIVATE KEY BLOCK-----';
            var privateKey = openpgp.key.readArmored(key).keys[0];
            privateKey.decrypt('passphrase');

            var pgpMessage = '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----';
            pgpMessage = openpgp.message.readArmored(pgpMessage);

            openpgp.decryptMessage(privateKey, pgpMessage).then(function(plaintext) {
              // success
            }).catch(function(error) {
              // failure
            });
          }
        }
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
