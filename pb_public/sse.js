document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('authToken') === null) {
    window.location.href = 'sse.html';
  }
});

const evtSource = new EventSource('/api/realtime');
const articleList = document.getElementById('articleList');

evtSource.addEventListener('PB_CONNECT', function (e) {
  console.log('Connected to PocketBase:', e);
  const id = e.lastEventId; 

  fetch('/api/realtime', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('authToken'), // Optional: Include auth token if needed
    },
    body: JSON.stringify({
      clientId: id,
      subscriptions: ['articles'],
    }),
    //requestKey: `realtime_${id}`,
  }).then((response) => {
    console.log(response);
  });
});

evtSource.addEventListener('articles', function (e) {
  const data = JSON.parse(e.data);
  console.log('Update in collection:', data);
  if (data.action === 'create') {
    const newElement = document.createElement('li');
    newElement.id = data.record.id;
    newElement.textContent = 'article: ' + data.record.title;
    articleList.appendChild(newElement);
  }
  if (data.action === 'delete') {
    const element = document.getElementById(data.record.id);
    element.remove();
    //articleList.removeChild();
  }
});