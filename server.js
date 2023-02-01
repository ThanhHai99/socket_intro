const {WebSocket} = require('ws')

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {
  // ws.on('message', function message(data) {
  //   console.log('received: %s', data);
  // });

  // ws.send('something');

  setInterval(() => {
    wss.clients.forEach(ws => {
      ws.send(new Date())
    })
  }, 1000)
});
