<img width="100" src="https://raw.githubusercontent.com/feross/standard/master/sticker.png" />

Detect if an IP is a Proxy / VPN or if it's considered bad

## Installation ##
```javascript
npm install --save potato-detection
```
## Setup ##
* **path** Create a directory somewhere, and point the **path** param to it.
* **mail** 
```javascript
const PotatoDetection = require('potato-cache')(path, 'info@example.com')
```
### Optional settings for Input ###
* ```flags: 'm'``` is used when you're only looking for the value of "1" as the result. The **m** flag skips the dynamic checks and only uses static ban lists.
* ```flags: 'b'``` is used when you want to use static ban and dynamic checks with partial bad IP check.
* ```flags: 'f'``` is used when you want to force the system to do a full lookup, which can take up to 5 seconds.
* ```oflags: 'b'``` is used when you want to see if the IP is considered as bad IP. Note that when using flags option, this result can vary.
* ```oflags: 'c'``` is used when you want to see which country the IP came from / which country the IP belongs to (GeoIP Location). Currently in alpha testing.
