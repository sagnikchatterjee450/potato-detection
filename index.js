'use strict'

const PotatoCache = require('potato-cache')

var contact

exports.setup = (mail, path, secret) => {
  if (isType(path, 'string') && isType(mail, 'string') && isType(secret, 'string')) {
    PotatoCache.setup(path, secret)
    contact = mail
  }
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
      // args.flags = defaultFor(args.flags, 'b')
      // If oflags is not defined, set it
      // args.oflags = defaultFor(args.oflags, '')

      if (isDefined(args.result)) {
        maxResult = args.result
        delete args.result
      }

      var url = 'http://check.getipintel.net/check.php?contact=' + contact + '&' + encodeUrl(args)
      this.get(url, (data) => {
        if (data.status === 'error') {
          reject(data)
        } else {
          if (data.result >= maxResult || (isDefined(data.BadIP) && data.BadIP === 1)) {
            reject(data)
          } else {
            resolve(data)
          }
        }
      })
    }
  })
}

exports.allowFrom = (cc, ip) => {
  return new Promise((resolve, reject) => {
    this.isValid({
      oflags: 'bc',
      ip: ip
    }).then(data => {
      // TODO: Since some shit is broken when it comes to arrays
      // * data.Country in cc
      // * cc.hasOwnProperty(data.Country)
      // * cc[data.Country] !== undefined
      // then it has to be indexOf
      if(cc.indexOf(data.Country) !== -1) {
        resolve(data)
      } else {
        reject(data)
      }
    }).catch(reject)
  })
}

exports.restrictFrom = (cc, ip) => {
  return new Promise((resolve, reject) => {
    // Do the opposite of allowFrom
    this.allowFrom(cc, ip)
    .then(reject)
    .catch(resolve)
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

exports.clearCache = (callback) => {
  PotatoCache.trash(callback)
}

exports.clearCacheSync = () => PotatoCache.trashSync()

function encodeUrl (obj) {
  if (isType(obj, 'object')) {
    var str = ''
    for (let key in obj) {
      if (str !== '') str += '&'
      str += key + '=' + encodeURIComponent(obj[key])
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
