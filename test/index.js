const PotatoDetection = require('../')

PotatoDetection.setup('marcussa2000@gmail.com', './cache', '1234')

PotatoDetection.restrictFrom(['DK', 'SE'], '87.59.201.225')
  .then(() => console.log('Allowed'))
  .catch(() => console.log('Restricted'))
