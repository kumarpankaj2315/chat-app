

const socket = io();

const $messageForm = document.querySelector('#form-data');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $sendLocation = document.querySelector('#send-location');
const $message = document.querySelector('#message');
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationTemplate = document.querySelector('#location-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
  insertMessage(message);
});

const autoScroll = () => {
  const $newMessage = $message.lastElementChild;
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //visible height

  const visibleHeight = $newMessage.offsetHeight;

  const containerHeight = $newMessage.scrollHeight;

  const scrollOffset = $message.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $message.scrollTop = $message.scrollHeight;
  }

}

function insertMessage(message) {
  const html = Mustache.render($messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  });
  $message.insertAdjacentHTML('beforeend', html);
  autoScroll();
}

function insertLocation(location) {
  console.log(location);
  const html = Mustache.render($locationTemplate, {
    username: location.username,
    location: location.text,
    createdAt: moment(location.createdAt).format('h:mm a')
  })
  $message.insertAdjacentHTML('beforeend', html);
  autoScroll();
}

socket.on('location', (location) => {
  insertLocation(location);
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render($sidebarTemplate, {
    room,
    users
  });
  document.querySelector('#sidebar').innerHTML = html;
})


$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = e.target.message.value;
  if (!message.trim()) {
    return alert(`can't send empty message`);
  }
  $messageFormButton.setAttribute('disabled', 'disabled');
  insertMessage({ text: message, createdAt: new Date().getTime(), username });

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log('Message was delivered', callback);
  });
})

$sendLocation.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported in your browser');
  }

  $sendLocation.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    const data = {
      latitude: position.coords.latitude, longitude: position.coords.longitude
    }
    socket.emit('sendLocation', data, (callback) => {
      $sendLocation.removeAttribute('disabled');
      console.log(callback);
    });
  })
})

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }

})

