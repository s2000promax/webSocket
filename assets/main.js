const socket = io();
const messages = document.querySelector('.messages');
const form = document.querySelector('.form');
const input = document.querySelector('.input');
const nameBlock = document.querySelector('.name');

const userName = prompt('Entre your name');
nameBlock.innerHTML = `${userName}`

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (input.value) {
    socket.emit('chat message', { messages: input.value, name: userName });
  }
  input.value = '';
});

socket.on('chat message', (data) => {
  const item = document.createElement('li');
  item.innerHTML = `<span>${data.name}</span>: ${data.messages}`;
  messages.appendChild(item);

  window.scrollTo(0, document.body.scrollHeight);
});
