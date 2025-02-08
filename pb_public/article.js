document.addEventListener('DOMContentLoaded', async function () {
  if (localStorage.getItem('authToken') === null) {
    window.location.href = 'login.html';
  }

  const articleList = document.querySelector('#articleList');

  try {
    // Fetch existing articles from PocketBase
    const response = await fetch(
      'http://localhost:8090/api/collections/articles/records',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('authToken'),
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      data.items.forEach((article) => {
        const newElement = document.createElement('li');
        newElement.id = article.id;
        newElement.textContent = `Article: ${article.title}`;
        articleList.appendChild(newElement);
      });
    } else {
      console.error('Error fetching articles:', await response.json());
    }
  } catch (err) {
    console.error('Unexpected error fetching articles:', err);
  }

  // Event listener for real-time updates
  const evtSource = new EventSource('/api/realtime');

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
        subscriptions: ['articles'],
      }),
    }).then((response) => console.log(response));
  });

  evtSource.addEventListener('articles', (e) => {
    const data = JSON.parse(e.data);
    console.log('Update in collection:', data);

    if (data.action === 'create') {
      const newElement = document.createElement('li');
      newElement.id = data.record.id;
      newElement.textContent = `Article: ${data.record.title}`;
      articleList.appendChild(newElement);
    }

    if (data.action === 'delete') {
      const element = document.getElementById(data.record.id);
      element?.remove();
    }
  });
});

// Form submission logic
document
  .getElementById('articleForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(
        'http://localhost:8090/api/collections/articles/records',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('authToken'),
          },
          body: JSON.stringify({
            title: title,
            content: content,
            author: userId,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        document.getElementById('message').textContent =
          'Article created successfully!';
        console.log('Article created:', data);
        document.getElementById('articleForm').reset();
      } else {
        const error = await response.json();
        document.getElementById('message').textContent =
          'Error: ' + error.message;
        console.error('Error:', error);
      }
    } catch (err) {
      document.getElementById('message').textContent =
        'An unexpected error occurred.';
      console.error('Unexpected error:', err);
    }
  });

// Logout logic
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  window.location.href = 'login.html';
}