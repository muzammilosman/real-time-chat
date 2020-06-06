/* eslint-disable no-undef */
// @ts-nocheck
const express = require('express')
const app = express()

const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const formatMessage = require('./utils/messages')
const { addUser, removeUser, getCurrentUser, getRoomUsers } = require('./utils/users')
const admin = 'Admin'

const server = http.createServer(app)
var io = socketio(server)

io.on('connection', socket => {
    console.log("New client connection")    

    socket.on('joinRoom', message => {
        const user = addUser(socket.id, message.username, message.room)
        socket.join(user.room)  // Joining a room
        socket.emit('note', formatMessage(admin,'You have joined the chat'))     // to the client connected
        socket.to(user.room).broadcast.emit('note', formatMessage(admin, `${user.username} joined the room`))
        
        io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)})
    })

    socket.on('message', message => {
        const user = getCurrentUser(socket.id)
        socket.emit('message', formatMessage(user.username, message)) 
        socket.to(user.room).emit('message', formatMessage(user.username, message))
    })

    socket.on('disconnect',() => {
        const user = getCurrentUser(socket.id)
        console.log(user)
        removeUser(socket.id)
        socket.to(user.room).emit('note', formatMessage(admin, `${user.username} has left the room`))

        io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)})
    })
})

// @ts-ignore
app.use(express.static(path.join( __dirname, 'public')))

server.listen(3000, () => console.log('Server started at port: 3000'))