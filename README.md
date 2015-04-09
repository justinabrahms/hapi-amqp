# hapi-amqp

This library is a hapi plugin for [amqplib](https://www.npmjs.com/package/amqplib).

[![wercker status](https://app.wercker.com/status/123df7e94f837350ab3fea1730d05273/s "wercker status")](https://app.wercker.com/project/bykey/123df7e94f837350ab3fea1730d05273)

## API

- `connection` - The amqplib connection object
- `createChannel(connection, cb)`
- `createConfirmChannel(connection, cb)`

Both of the channel objects call the callback (`cb`) with `err,
channel` as arguments.

The connection is established once and is reused between requests.

It passes the options provided directly to `amqplib`, with the
exception of the `api` argument which can be `'promise'` which will
use the promise based API for amqplib instead of the callback one.

## Example

```js
amqp.createConfirmChannel(amqp.connection, function (err, channel) {
  if (err) {
    reply('couldnt create channel');
    return;
  }

  channel.assertQueue(queueName, {durable: true}, function (queueErr, ok) {
    if (queueErr || !ok) {
      reply('Err: ' + queueErr + ' ok? ' + ok);
      return;
    }

    channel.sendToQueue(queueName, new Buffer(JSON.stringify({foo: 'bar'})), {mandatory: true, persistent: true}, function (publishErr) {
      channel.close(function () {
        if (publishErr) {
          reply(publishErr);
          return;
        }

        reply(null, 'worked.');
      });
    });
  });
});

```
