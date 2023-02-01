const {WebSocket} = require('ws')
const net = require("net");

const ws = new WebSocket('ws://localhost:3000')

ws.on('message', time => {
    console.log('broadcast receiver: %s', time);
});

ws.on("error", err => {
    console.log(err)
})

// const client = new net.createConnection({
//     port: 3001,
//     host: 'localhost'
// })

// client.on('message', (data) => {
//     console.log(data)
// })
