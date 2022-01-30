const chromeCookieFinder = require('../index');

chromeCookieFinder('http://www.baidu.com').then(a => console.log(a.cookies))