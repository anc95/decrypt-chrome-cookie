/**
 * @author anchao01
 * @description 根据地址获取chrome相关cookie
 * @date 2018年6月17日
 */

var fs = require( 'fs' )
var sqlite3 = require( 'sqlite3' ).verbose()
var url = require('url')
var crypto = require('crypto-js')

function getCookieInfo() {
    var info = {
        path: '',
        password: '',
        iterations: 0
    }
    if (password instanceof Promise) {
        return npassword
        .then(function(psd) {
            info.password = psd
            console.log(info)
        })
    }

    resolve(info)
    var password = null

    return new Promise(function(resolve) {
        switch( process.platform ) {
            case 'darwin':
                info.path = process.env.HOME + '/Library/Application Support/Google/Chrome/Default/Cookies'
                password = require('keytar').getPassword('Chrome Safe Storage', 'Chrome')
                info.iterations = 1003
                break;
            case 'linux':
                info.path = process.env.HOME + '/.config/google-chrome/Default'
                info.password = 'peanuts'
                info.iterations = 1
                break;
            default:
                console.error( 'Currently your OS is not supported!' )
                process.exit(1);
        }

        if (password instanceof Promise) {
            return password
            .then(function(psd) {
                info.password = psd
            })
        }

        resolve(info)
    })
}

function initDB(path) {
    if (!fs.existsSync(path)) {
        throw(new Error('Ensure Chrome is installed on this deveice?'))
    }

    db = new sqlite3.Database(path)
    return db
}

module.exports = function (url, callback) {
    getCookieInfo()
    .then(function(cookieInfo) {
        db = initDB(cookieInfo.path)
        db.serialize(function() {
            db.each( "SELECT * FROM cookies where host_key like '%" + 'baidu' + "%'", function( err, cookie ) {
                if ( err ) {
                    throw err;
                }

                // console.log(cookie)
            });
        });

        console.log(cookieInfo)
        
        db.close();
    })
}

module.exports()