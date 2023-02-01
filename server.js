const express = require('express')
const http = require('http')
const WebSocket = require("ws")
const net = require("net");
const {WebSocketServer} = WebSocket

// const server = http.createServer(express)
const server = net.createServer()
const port = 8080
const wss = new WebSocket.Server({server: server})

wss.on("connection", ws => {
    console.log()
    setInterval(() => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                let currentTime = new Date()
                client.send(currentTime)
            }
        })
    }, 1000)
})

wss.on("close", ws => {
    console.log(`client ${ws.clientId} was closed`)
})

server.listen(port, function () {
    console.log(`Server is listening on ${port}!`)
})
