# encryptUrl

Encrypt and share URLs.

## Info

Encrypt a URL with a key. Only individuals with this key can decrypt your URL.
Successfully decrypting a URL results in a redirect. In essence, it works like a
URL shortener, with the advantage of encryption and password protection. All
information is securely stored as well.

## Hosted Version
Currently accessible at [url.encrypt.se](https://url.encrypt.se/).

## Local Installation
```
git pull
cd encryptUrl
npm i
```
The database table can be created with `utils/db-schema-starting-point.sql`.
