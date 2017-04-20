<img width="100" src="https://raw.githubusercontent.com/feross/standard/master/sticker.png" />

## Why? ##
Detect if an IP is a Proxy / VPN or if it's considered as bad.

## Installation ##
```javascript
npm install --save potato-detection
```
## Setup ##
Create a directory somewhere, and point the **path** param to it.

Include your contact information so the author of [getipintel](http://getipintel.net) can notify me if a problem arise or if there are core changes. In some situations, people query the system in a wrong manner and assume everything is working (but due to the lack of or improper handling of error codes), it's not the case. Since he only have the connecting IP address, he cannot help the person correct the error.

```javascript
const PotatoDetection = require('potato-detection')('./path', 'info@example.com')
```
## API ##

### isValid([options]).then(data).catch(data) ###
* ```flags: 'm'``` is used when you're only looking for the value of "1" as the result. The **m** flag skips the dynamic checks and only uses static ban lists.
* ```flags: 'b'``` is used when you want to use static ban and dynamic checks with partial bad IP check. **default**
* ```flags: 'f'``` is used when you want to force the system to do a full lookup, which can take up to 5 seconds.
* ```oflags: 'b'``` is used when you want to see if the IP is considered as bad IP. Note that when using flags option, this result can vary.
* ```oflags: 'c'``` is used when you want to see which country the IP came from / which country the IP belongs to (GeoIP Location). Currently in alpha testing.

```javascript
PotatoDetection.isValid({
  oflags: 'bc' // You can combine both b and c to see
               // if it's a BadIP and what country the IP belongs to
  result: '1',
  ip: 'some ip'
}).then(data => {
   console.log('IP is valid: ' + data)
}).catch(data => {
   console.log('IP is invalid: ' + data)
})
```

### clearCacheSync() ###
Clears the entire cache directory synchronously

```javascript
PotatoDetection.clearCacheSync()
```

### clearCache(callback) ###
Clears the entire cache directory asynchronously

```javascript
PotatoDetection.clearCache(() => {
  ...
})
```

### Expected Output ###
On usage of ```isValid()``` function it will return a promise with
* ```then``` when the outputted result is lower than your allowed result
* ```catch``` when the outputted result is greater or equal to your allowed result
**default** is set to 0.9
