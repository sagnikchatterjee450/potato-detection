const PotatoDetection = require('../')('./cache', 'marcussa2000@gmail.com')

PotatoDetection.isValid({
  oflags: 'c',
  ip: '87.59.201.225'
}).then(console.log)
  .catch(console.log)
