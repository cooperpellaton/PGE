/*This is the code that will encrypt the previously grabbed JSON blob.*/
/*The generation of the key pair. */
var openpgp = require('openpgp');

var options = {
  numBits: 2048,
  var userID = user;
  userId: user-select,
  passphrase: password,
};

openpgp.generateKeyPair(options).then(function(keypair) {
  // success
  var privkey = keypair.privateKeyArmored;
  var pubkey = keypair.publicKeyArmored;
}).catch(function(error) {
  // failure
});

/*Encrypting the key pair. */
var openpgp = require('openpgp');

var key = '-----BEGIN PGP PUBLIC KEY BLOCK ... END PGP PUBLIC KEY BLOCK-----';
var publicKey = openpgp.key.readArmored(key);

openpgp.encryptMessage(publicKey.keys, 'Hello, World!').then(function(pgpMessage) {
    // success
}).catch(function(error) {
    // failure
});

/*Decrypting the key pair. */
var openpgp = require('openpgp');

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
