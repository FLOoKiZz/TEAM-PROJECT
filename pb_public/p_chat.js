if(localStorage.getItem("authToken") == null){
    window.location.href= "login.html"
}
loadChatHistory();

const sub = document.getElementById('chatForm')
sub.addEventListener("submit", (event) => {
    event.preventDefault();
    const from = localStorage.getItem("userId")
    const myMessage = document.getElementById("sentMessage").value
    const to = document.getElementById("toguy").value
    const responce = fetch("http://127.0.0.1:8090/api/collections/pmessages/records", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            content: myMessage,
            from: from,
            to: to,
          }),
    })
    if(responce.ok){
        const data = responce.JSON();
        console.log("user created : " , data)
    }else{

    }
})



const evtSource = new EventSource('/api/realtime');
const chatMessages = document.getElementById('chatMessages');

evtSource.addEventListener('PB_CONNECT', (e) => {
    console.log('Connected:', e);
    const id = e.lastEventId;

    const res = fetch('/api/realtime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            clientId: id,
            subscriptions: ['pmessages'],
        }),
    })

    evtSource.addEventListener('pmessages', (e) => {
        const data = JSON.parse(e.data);
        if (data.action === 'create') {
            const newMessage = document.createElement('li');
            newMessage.textContent = `${data.record.from}: ${data.record.content}`;
            chatMessages.appendChild(newMessage);
        }
    });

});



async function loadChatHistory() {
        const response = await fetch(
            'http://127.0.0.1:8090/api/collections/pmessages/records',
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
                // if (message.from == localStorage.getItem("userId") || message.to == localStorage.getItem("userId")){
                    const messageElement = document.createElement('li');
                    messageElement.textContent = `${message.from}:old ${message.content}`;
                    chatMessages.appendChild(messageElement);
                // }
            });
        } else {
            console.error('Failed to fetch message history:', await response.json());
        }
}