// ==UserScript==
// @name         Fastmail Interceptor
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

//Tampermonkey is claiming that this, the above, will throw an error but the Chrome Extension will require this to allow cross site scripting.

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
				//facade.response = request.response;
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

var params = {
	encrypt_for: userId,
	sign_with: user_pgp_key,
	msg: 'data'
};

kbpgp.box(params, function(err, result_string, result_buffer) {
	console.log(err, result_string, result_buffer);
});

//Need to insert key loading here so that box can handle.
//https://keybase.io/kbpgp/docs/loading_a_key

//This is a key loader, it initializes with the users public key and then adds the private key to it aferward. This will throw and error if the private key does not match the public key.
var userID_public_key = "-----BEGIN PGP PUBLIC ... etc.";
var userID_private_key = "-----BEGIN PGP PRIVATE ... etc.";
var userID_passphrase = "ovarian fred savage ";

//Any variable defined or starting with 'userID' needs to explicitly defined through another function which I have not yet written. This build will continue to fail until that has been done.

kbpgp.KeyManager.import_from_armored_pgp({
	armored: userID_public_key
}, function(err, userID) {
	if (!err) {
		userID.merge_pgp_private({
			armored: userID_private_key
		}, function(err) {
			if (!err) {
				if (userID.is_pgp_locked()) {
					userID.unlock_pgp({
						passphrase: userID_passphrase
					}, function(err) {
						if (!err) {
							console.log("Loaded private key with passphrase");
						}
					});
				} else {
					console.log("Loaded private key w/o passphrase");
				}
			}
		});
	}
});


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

//The below is the addition of the encrypt function.
//Pulling in Keybase API to grab keys off the keyring for a signing authority to be established.
var encrypt = function(s) {
	var promise;
	/*Below grabbed from the gmail-crypt open source plugin. All credit to Sean Coyler.
	https://github.com/seancolyer/gmail-crypt/ */
	var publicKeys = prepareAndValidateKeysForRecipients(recipients, from);
	if (publicKeys && publicKeys.type && publicKeys.type == "error") {
		promise = Promise.resolve(publicKeys);
	} else {
		promise = openpgp.encryptMessage(publicKeys, message);
	}
	handleResponsePromise(promise, callback);
}

/*This is sample code from KeybasePGP that encrypts a provided message.
TODO: write a function that parses the input data that we have to make it accessible to the encrypt and decrypt functions.
var params = {
  msg:         "Chuck chucky, bo-bucky! This is Alice here!",
  encrypt_for: chuck,
  sign_with:   alice
};

kbpgp.box (params, function(err, result_string, result_buffer) {
  console.log(err, result_string, result_buffer);
});
End instance of sample code.*/

//This function is currently undefined and will need to return the decrypted text via the key handler that was provided above.
var decrypt = function(s) {}
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
