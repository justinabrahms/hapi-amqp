var rewire = require('rewire');
var assert = require('assert');
var sinon = require('sinon');

var plugin = rewire('./index');

// Mock out the underlying amqplib, so as not to make http connections.
plugin.__set__('amqp', {
  connect: function (url, cb) {
    cb();
  }
});


var validateApi = function (value, done) {
  var server = {
    expose: sinon.spy()
  };

  plugin.register(server, {}, function (err) {
    assert.equal(err, null);
    assert(server.expose.withArgs(value).called, "Didn't register API for " + value);
    done();
  });
};

describe('amqp hapi plugin', function () {
  describe('public api', function () {
    it('should expose a connection object', function (done) {
      validateApi('connection', done);
    });

    it('should expose createConfirmChannel', function (done) {
      validateApi('createConfirmChannel', done);
    });

    it('should expose createChannel', function (done) {
      validateApi('createChannel', done);
    });
  });
});
