/**
 * @author anchao01
 * @description 根据地址获取chrome相关cookie
 * @date 2018年6月17日
 */

var fs = require( 'fs' )
var sqlite3 = require( 'sqlite3' ).verbose()
var url = require('url')
var crypto = require('crypto')

var KEY_LENGTH = 16
var SALT = 'saltysalt'
var IV = new Buffer(new Array(KEY_LENGTH + 1).join(' '))

var DBIns = getDBIns()

function getCookieInfo() {
    var info = {
        path: '',
        key: ''
    }

    var password = null
    var iterations = 0

    return new Promise(function(resolve) {
        switch( process.platform ) {
            case 'darwin':
                info.path = process.env.HOME + '/Library/Application Support/Google/Chrome/Default/Cookies'
                password = require('keytar').getPassword('Chrome Safe Storage', 'Chrome')
                iterations = 1003
                break;
            case 'linux':
                info.path = process.env.HOME + '/.config/google-chrome/Default'
                password = 'peanuts'
                iterations = 1
                break;
            default:
                console.error( 'Currently your OS is not supported!' )
                process.exit(1);
        }

        if (password instanceof Promise) {
            return password
            .then(function(psd) {
                info.key = getDerivedKey(psd, iterations)
                resolve(info)
            })
        }

        info.key = getDerivedKey(password, iterations)
        resolve(info)
    })
}

function getDerivedKey(password, iterations) {
    return crypto.pbkdf2Sync(password, SALT, iterations, KEY_LENGTH, 'sha1')
}

function decryptorCookie(key, iv, encryptedCookie) {
    decipher = crypto.createDecipheriv('AES-128-CBC', key, iv)
    decryptedCookie = decipher.update(encryptedCookie.slice(3))

    return decryptedCookie.toString() + decipher.final('utf8')
}

function getDBIns(path) {
    var db = null
    var dbClose = false

    if (!fs.existsSync(path)) {
        throw(new Error('Ensure Chrome is installed on this deveice?'))
    }

    return {
        getDB: function(path) {
            if (dbClose) {
                db = new sqlite3.Database(path)
            }

            return db
        },
        closeDB: function(callback) {
            if (dbClose) {
                return
            }

            db.close(function(err, cb) {
                db.dbClose = true

                if (err) {
                    return callback(err)
                }
            })
        }
    }
}

function ifMatchHost(rawUrl, hostKey) {
    return rawUrl.indexOf(hostKey) > -1
}

function getDomain(hostname) {
    hostname = hostname.toLowerCase()
    var res = /(\.[a-z]+\.[a-z]+$)/.exec(hostname)

    return res && res[1]
}

module.exports = function (urlVal, callback) {
    var urlInfo = url.parse(urlVal)
    var cookies = {}
    var fullCookiesInfo = []
    var hasCallback = typeof callback === 'function'
    var domain = getDomain(urlInfo.hostname)

    return getCookieInfo()
    .then(function(cookieInfo) {
        db = DBIns.getDB(cookieInfo.path)
        db.serialize(function() {
            db.each( "SELECT * FROM cookies where host_key like '%" + domain + "%'", function( err, cookie ) {
                if (err) {
                    if (hasCallback) {
                        return callback(err)
                    }
                }

                if (cookie.value === '' && cookie.encrypted_value.length > 0) {
                    cookie.value = decryptorCookie(cookieInfo.key, IV, cookie.encrypted_value)
                }

                if (ifMatchHost(urlVal, cookie.host_key)) {
                    if (cookies[cookie.name]) {
                        cookies[cookie.name] += '; ' + cookie.value
                    }

                    cookies[cookie.name] = cookie.value
                }

                fullCookiesInfo.push(cookie)
            }, function() {
                if (hasCallback) {
                    DBIns.closeDB(function(err) {
                        if (err) {
                            return callback(err)
                        }
                    })
                    return callback(null, cookies, fullCookiesInfo)
                }
            });

        });
    })
}