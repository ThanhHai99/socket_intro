const WebSocket = require('ws')

const ws = new WebSocket('ws://localhost:8080');

// ws.on('open', function open() {
//   ws.send('something');
// });

ws.on('message', data => {
    console.log('Broadcast: %s', data);
});

// ws.emit("room", )