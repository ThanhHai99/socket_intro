const {WebSocket} = require('ws')

const ws = new WebSocket('ws://localhost:3000')

// wss.on('connection', function connection(ws) {
//     // ws.on('message', function message(data) {
//     //   console.log('received: %s', data);
//     // });
//
//     ws.send('something');
// });

ws.on('message', data => {
    console.log('broadcast time: %s', data);
});