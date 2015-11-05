# PGE

https://travis-ci.org/cooperpellaton/PGE.svg?branch=master

*What is PGE you say to yourself?* PGE means "Pretty Good Email," which is an email encryptor based on the Pretty Good Protection specification. The core selling point of PGE is that all encryption happens locally, on the client computer before any data is transmitted. Thus, one can rest assured that even their most secure of secrets will not fall into the wrong hands during transmission as the only time the unencrypted file will be seen is on the client computer at the time of the emails inception, and at the time of opening by the intended recipient.

Using [OpenPGP.js](http://openpgpjs.org/) and the Keybase API as well as [KBPGP.js](https://keybase.io/kbpgp) we check a users email against existing accounts to figure out their public keys and then use this information to encrypt her email. This is currently written to work with [FastMail](http://fastmail.fm) and expressly being tested as a [Greasemonkey/Tampermonkey](http://www.greasespot.net/) script. It is the intention of this project to bundle it as a Chrome extension, which given proper care in our XMLHttpRequest header will be able to parse data coming from any email provider and thus render the same surface.

Ideally, once the core of the interceptor is written it will then be transcribed into a popup.js file which when bundled with the rest of the Chrome extension configuration files can then be downloaded, compiled locally and imported as a Chrome extension via the dev tools.

State of development-- the request handler has been written and works exceptionally with Fastmail in Chrome. It is the encryption and decryption of the body via the Keybase API, as well as OpenPGP.js, that is currently being actively developed.

I will add more code blocks and an indepth explanation of the project once the interceptor is 100% functional. Currently I am able to encrypt emails *most* of the time with a less than desireable decryption frequency. *But hey, at least efficiency and run time isn't the issue I'm trying to resolve!*
