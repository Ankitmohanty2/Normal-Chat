const socket = io();
let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
let userList = document.querySelector('.user__list');

// Get user name
do {
    name = prompt('Please enter your name:');
} while (!name);

// Notify server about new user
socket.emit('new-user', name);

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(e.target.value);
    }
});

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    };
    if (msg.message) {
        appendMessage(msg, 'outgoing');
        textarea.value = '';
        scrollToBottom();
        socket.emit('message', msg);
    }
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
        <span class="timestamp">${new Date().toLocaleTimeString()}</span>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

// Receive messages
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrollToBottom();
});

// Update user list
socket.on('user-list', (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        let li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
    });
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
