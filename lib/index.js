var amqp = require('amqplib/callback_api');

// TODO(justinabrahms): Should we be keeping a registry of queues here for performance?
module.exports.register = function (plugin, userOptions, next) {

  // TODO(justinabrahms): Do we need default options here?
  // TODO(justinabrahms): Joi validation?
  // TODO(justinabrahms): merge default + user options
  var options = userOptions;
  if (options.api === 'promise') {
    // swap out default implementation to the promise-based one
    amqp = require('amqplib');
  }
  delete options.api;

  if (!options.url) {
    options.url = 'amqp://localhost';
  }

  // plugin.expose('exchange', function (connection, name, exchangeOptions, callback) {
  //   console.log('in exchange handler: ', name, exchangeOptions);
  //   connection.exchange(name, exchangeOptions, callback);
  // });

  plugin.expose('createConfirmChannel', function (connection, cb) {
    connection.createConfirmChannel(cb);
  });

  plugin.expose('createChannel', function (connection, cb) {
    // TODO(justinabrahms): How do we handle errors/drains/etc?
    connection.createChannel(cb);
  });

  amqp.connect(options.url, function (err, conn) {
    if (err) {
      next(err);
      return;
    }
    plugin.expose('connection', conn);
    next();
  });
};

module.exports.register.attributes = {
  pkg: require('../package.json')
};
