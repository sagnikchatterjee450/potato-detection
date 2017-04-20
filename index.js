'use strict'

var PotatoCache
var contact

var config = module.exports = (path, mail) => {
  if (isType(path, 'string') && isType(mail, 'string')) {
    contact = mail
    PotatoCache = require('potato-cache')(path)
  }
  return exports
}

exports.isValid = (args) => {
  return new Promise((resolve, reject) => {
    var maxResult = '0.9'
    if (isType(args, 'object')) {
      // Set output format to json
      args.format = 'json'
      // If IP is not defined, set it
      args.ip = defaultFor(args.ip, require('ip').address())
      // If flags is not defined, set it
      args.flags = defaultFor(args.flags, 'b')
      // If oflags is not defined, set it
      args.oflags = defaultFor(args.oflags, 'b')

      if (isDefined(args.result)) {
        maxResult = args.result
        delete args.result
      }

      var url = 'http://check.getipintel.net/check.php?contact=' + contact + '&' + encodeUrl(args)
      console.log(url)
      this.get(url, (data) => {
        if (data.status == 'error') {
          reject(data)
        } else {
          if(data.result >= maxResult) {
            resolve(data)
          } else {
            reject(data)
          }
        }
      })
    }
  })
}

exports.get = (url, callback) => {
  if (isType(url, 'string') && isType(callback, 'function')) {
    PotatoCache.existsThenRead(url)
      .then(callback)
      .catch(() => {
        require('axios').get(url)
          .then(res => {
            PotatoCache.write(url, res.data, callback)
          })
          .catch(onError)
      })
  }
}

exports.clear = (callback) => {
  PotatoCache.trash(callback)
}

exports.clearSync = () => PotatoCache.trashSync()

function encodeUrl (obj) {
  if (isType(obj, 'object')) {
    var str = ''
    for (let key in obj) {
      if (str != "") str += "&"
      str += key + "=" + encodeURIComponent(obj[key])
    }
    return str
  }
}

/**
 * Checks if a parameter matches a certain type
 */
function isType (key, type) {
  if (typeof key === type) {
    return true
  } else {
    onError('Parameter (' + key + ') must be a ' + type)
    return false
  }
}

/**
 * Checks if a parameter is set
 */
function isDefined (key) {
  return typeof key !== 'undefined'
}

/**
 * Throws an error
 */
function onError (err) {
  throw new Error(err)
}

/**
 * @author <http://stackoverflow.com/a/894877/2959686>
 */
function defaultFor (arg, val) {
  return typeof arg !== 'undefined' ? arg : val
}
