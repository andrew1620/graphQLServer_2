var amqp = require("amqplib/callback_api");

const sendData = data => {
  amqp.connect("amqp://192.168.1.13", function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = "geo_pos";
      // var msg = process.argv.slice(2).join(' ') || "Hello World!";
      var msg = "Hello World!";

      // При вызове функции в аргумнетах получим объект с геоданными, закидываем их в msg и отправляем
      // var msg = data;

      channel.assertQueue(queue, {
        durable: true
      });
      channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true
      });
      console.log(" [x] Sent '%s'", msg);
    });
    setTimeout(function() {
      connection.close();
      process.exit(0);
    }, 500);
  });
};

module.exports = sendData;

// var amqp = require("amqplib/callback_api");

// amqp.connect("amqp://192.168.1.13", function(error0, connection) {
//   if (error0) {
//     throw error0;
//   }
//   connection.createChannel(function(error1, channel) {
//     if (error1) {
//       throw error1;
//     }
//     var queue = "geo_pos";
//     // var msg = process.argv.slice(2).join(' ') || "Hello World!";
//     var msg = "Hello World!";

//     channel.assertQueue(queue, {
//       durable: true
//     });
//     channel.sendToQueue(queue, Buffer.from(msg), {
//       persistent: true
//     });
//     console.log(" [x] Sent '%s'", msg);
//   });
//   setTimeout(function() {
//     connection.close();
//     process.exit(0);
//   }, 500);
// });
