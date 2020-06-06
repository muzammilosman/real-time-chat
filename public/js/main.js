/* eslint-disable no-undef */
// @ts-nocheck
const chatForm = document.getElementById('chat-form')
const chatMessages = document.getElementById('chatMessages')
const roomName = document.getElementById('room-name')
const roomUsers = document.getElementById('users')

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

console.log(username, room)

// eslint-disable-next-line no-undef
const socket = io()

socket.emit('joinRoom', {username, room})

socket.on('note', (message) => {
    outputNote(message)
})

socket.on('message', message => {
    outputMessage(message)
})

socket.on('roomUsers', roominfo => {
    updateRoomInfo(roominfo)
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.msg.value
    socket.emit('message', msg)
    e.target.msg.value = ''
})

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('messages')
    div.innerHTML = `<div class="user">${message.username}:</div>
                     <div class="new-msg"> ${message.message} <div class="time"> ${message.time} </div> </div>`
                     
    chatMessages.append(div)
    chatMessages.scrollTop = chatMessages.scrollHeight
} 

function outputNote(message){
    const div = document.createElement('div')
    div.classList.add('admin-note')
    div.innerHTML = `<p class="note-detail"> ${message.message} </p>`
    chatMessages.append(div)
    chatMessages.scrollTop = chatMessages.scrollHeight
}

function updateRoomInfo(roominfo){
    console.log(roominfo)
    roomName.innerHTML = `${roominfo.room}`
    roomUsers.innerHTML = `${roominfo.users.map(user => `<li>${user.username}</li>`).join('')}`
}