import './style.css';
import axios from 'axios';

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="fetchRedirect">Fetch Redirect</button>
    </div>
    <p id="responseData"></p>
  </div>
`;

document.getElementById('fetchRedirect').addEventListener('click', async () => {
  const responseElement = document.getElementById('responseData');
  responseElement.textContent = 'Redirecting...';
  try {
      const response = await axios.get('http://localhost:3000/old-route', {
          maxRedirects: 0,
          validateStatus: status => status >= 200 && status < 400,
      });
      
      if (response.status === 302) {
          responseElement.textContent = `Redirecting to: ${response.data.redirectTo}`;
          
          setTimeout(async () => {
              const redirectedResponse = await axios.get(`http://localhost:3000${response.data.redirectTo}`);
              responseElement.textContent = `Redirected Response: ${JSON.stringify(redirectedResponse.data)}`;
          }, 1000);
      } else {
          responseElement.textContent = `Response: ${JSON.stringify(response.data)}`;
      }
  } catch (error) {
      responseElement.textContent = error.response ? `Error: ${error.response.status} - ${error.response.data.message}` : 'Request failed';
  }
});