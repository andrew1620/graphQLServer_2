var amqp = require("amqplib/callback_api");

const getData = () => {
  let result;

  amqp.connect("amqp://192.168.1.13", function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = "geo_pos";

      channel.assertQueue(queue, {
        durable: true
      });
      channel.prefetch(1);
      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queue
      );
      channel.consume(
        queue,
        function(msg) {
          var secs = msg.content.toString().split(".").length - 1;

          console.log(" [x] Received %s", msg.content.toString());
          result = ms.connect.toString();
          setTimeout(function() {
            console.log(" [x] Done");
            channel.ack(msg);
          }, secs * 1000);
        },
        {
          noAck: false
        }
      );
    });
  });
  return result;
};
// export default getData;
module.exports = getData;
