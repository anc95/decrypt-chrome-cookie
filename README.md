# chrome-cookie-finder
decrypt chrome cookie in javascript way

## install
```
npm install chrome-cookie-finder
```

## usage
### Callback

```js
var finder = require('chrome-cookie-finder')
finder('http://www.baidu.com', function(err, cookie, fullCookieInfo) {
    if (err) {
        return console.log(err)
    }

    console.log('cookie: ', cookie)
    console.log('fullCookieInfo: ', fullCookieInfo)
})
```

### Promise
```js
var finder = require('chrome-cookie-finder')

async function main() {
    const { cookies, fullCookieInfo } = await finder('http://www.baidu.com');
}
```
## related link
Inspired By [https://n8henrie.com/2014/05/decrypt-chrome-cookies-with-python](https://n8henrie.com/2014/05/decrypt-chrome-cookies-with-python/)