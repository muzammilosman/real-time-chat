// @ts-nocheck
const express = require('express')
const app = express()

const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const formatMessage = require('./utils/messages')
const admin = 'Admin'

const server = http.createServer(app)
var io = socketio(server)

io.on('connection', socket => {
    console.log("New client connection")
    socket.emit('note', 'Hey you are connected')     // to the client connected
    socket.broadcast.emit('note', formatMessage(admin, 'A user has joined'))    // broadcast except to the client which connected
    
    socket.on('disconnect',() => {
        io.emit('note', 'a user has left the  chat')
    })
    socket.on('message', message => {
        console.log(message)
        io.emit('message', message)
    })
})

// @ts-ignore
app.use(express.static(path.join( __dirname, 'public')))

server.listen(3000, () => console.log('Server started at port: 3000'))