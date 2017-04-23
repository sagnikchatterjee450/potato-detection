const PotatoDetection = require('../')

PotatoDetection.setup('info@example.com', './cache', '1234')

PotatoDetection.restrictFrom(['DK', 'SE'], '127.0.0.1')
  .then(() => console.log('Allowed'))
  .catch(() => console.log('Restricted'))
