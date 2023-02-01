const {WebSocket} = require('ws')
const net = require("net");
const port = 3000
// const server = net.createServer()
const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws) {
  // ws.on('message', function message(data) {
  //   console.log('received: %s', data);
  // });

  // ws.send('something');

  setInterval(() => {
    wss.clients.forEach(ws => {
      const currentTime = new Date()
      console.log('Sending broadcast: ', currentTime)
      ws.send(currentTime)
    })
  }, 1000)
});

// server.listen({ port: port }, () => {
//   console.log(`Server listening at port ${port}`)
// })
