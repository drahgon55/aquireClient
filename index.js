var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();
var args = process.argv.slice(2);

console.log("user", args[0])
let userId = args[0]

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }

		//let json = JSON.parse(message)
    });

    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(JSON.stringify({id: userId, num: number.toString()}));
            //setTimeout(sendNumber, 1000);
        }
    }

	function sendId() {
        if (connection.connected) {

            connection.sendUTF(JSON.stringify({id: userId, event: "sendId"}));

        }
    }

	sendId()
    sendNumber();

});

client.connect('ws://localhost:8080/', 'echo-protocol');
