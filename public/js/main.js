const chatForm = document.getElementById('chat-form')

const socket = io()

socket.on('note', (message) => {
    console.log(message)
})

socket.on('message', message => {
    outputMessage(message)
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.msg.value
    socket.emit('message', msg)
})

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('messages')
    div.innerHTML = `<p class="meta"> ${message} </p>`
    document.getElementById('chatMessages').append(div)
}