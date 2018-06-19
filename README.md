# chrome-cookie-finder
decrypt chrome cookie in javascript way

## install
```
npm install chrome-cookie-finder
```

## ussage
```
var finder = require('chrome-cookie-finder')
finder('http://www.baidu.com', function(err, cookie, fullCookieInfo) {
    if (err) {
        return console.log(err)
    }

    console.log('cookie: ', cookie)
    console.log('fullCookieInfo: ', fullCookieInfo)
})
```

## related link
[https://n8henrie.com/2014/05/decrypt-chrome-cookies-with-python](https://n8henrie.com/2014/05/decrypt-chrome-cookies-with-python/)