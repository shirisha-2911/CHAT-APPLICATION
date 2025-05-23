document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const messagesContainer = document.getElementById('messages');
  const usernameInput = document.getElementById('username-input');
  const joinButton = document.getElementById('join-btn');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-btn');
  const usernameSection = document.getElementById('username-section');
  const messageSection = document.getElementById('message-section');

  // Join Chat Function
  joinButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
      socket.emit('newUser', username);
      usernameSection.style.display = 'none';
      messageSection.style.display = 'flex';
      messageInput.focus();
    } else {
      alert('Please enter your name!');
    }
  });

  // Send Message Function
  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      socket.emit('chatMessage', {
        user: usernameInput.value.trim(),
        text: message
      });
      addMessage(`You: ${message}`, true);
      messageInput.value = '';
    }
  }

  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Message Handler
  socket.on('message', (msg) => {
    addMessage(`${msg.user}: ${msg.text}`, false);
  });

  // Update Online Users
  socket.on('updateUsers', (users) => {
    document.getElementById('user-count').textContent = users.length;
  });

  // Add Message to DOM
  function addMessage(content, isCurrentUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isCurrentUser ? 'user-message' : 'other-message');
    messageElement.textContent = content;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
});