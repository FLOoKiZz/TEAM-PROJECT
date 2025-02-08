if (localStorage.getItem('authToken') === null) {
    window.location.href = 'login.html';
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    window.location.href = 'login.html';
}

const evtSource = new EventSource('/api/realtime');
const chatMessages = document.getElementById('chatMessages');

async function loadChatHistory() {
    try {
        const response = await fetch(
            'http://127.0.0.1:8090/api/collections/messages/records',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('authToken'),
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            data.items.forEach((message) => {
                const messageElement = document.createElement('li');
                messageElement.textContent = `${message.sender}: ${message.content}`;
                chatMessages.appendChild(messageElement);
            });
        } else {
            console.error('Failed to fetch message history:', await response.json());
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

evtSource.addEventListener('PB_CONNECT', (e) => {
    console.log('Connected to PocketBase:', e);
    const id = e.lastEventId;

    fetch('/api/realtime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clientId: id,
            subscriptions: ['messages'],
        }),
    }).then((response) => console.log(response));
});

evtSource.addEventListener('messages', (e) => {
    const data = JSON.parse(e.data);
    if (data.action === 'create') {
        const newMessage = document.createElement('li');
        newMessage.textContent = `${data.record.sender}: ${data.record.content}`;
        chatMessages.appendChild(newMessage);
    }
});

document.querySelector('#chatForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const messageContent = document.querySelector('#chatInput').value;

    fetch('http://127.0.0.1:8090/api/collections/messages/records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
        body: JSON.stringify({
            content: messageContent,
            sender: localStorage.getItem('userId'),
            timestamp: new Date().toISOString(),
        }),
    }).then(() => {
        document.querySelector('#chatInput').value = ''; // Clear input field
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
});
