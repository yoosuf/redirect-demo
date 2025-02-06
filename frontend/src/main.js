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

const responseElement = document.getElementById('responseData');

// Axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000'
});

// Modify Axios to treat 302 as a valid response
api.interceptors.response.use(
    async (response) => {
        if (response.status === 302 && response.data.redirectTo) {
            responseElement.textContent = `Redirecting to: ${response.data.redirectTo}`;

            // Delay to simulate a transition
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Fetch redirected data
            return api.get(response.data.redirectTo)
                .then(redirectedResponse => {
                    responseElement.textContent = `Redirected Response: ${JSON.stringify(redirectedResponse.data)}`;
                    return redirectedResponse;
                });
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 302) {
            const redirectTo = error.response.data.redirectTo;
            responseElement.textContent = `Redirecting to: ${redirectTo}`;

            // Delay before following redirect
            return new Promise(resolve => setTimeout(resolve, 1000))
                .then(() => api.get(redirectTo))
                .then(redirectedResponse => {
                    responseElement.textContent = `Redirected Response: ${JSON.stringify(redirectedResponse.data)}`;
                    return redirectedResponse;
                });
        }

        responseElement.textContent = error.response
            ? `Error: ${error.response.status} - ${error.response.data.message}`
            : 'Request failed';
        return Promise.reject(error);
    }
);

document.getElementById('fetchRedirect').addEventListener('click', async () => {
    responseElement.textContent = 'Redirecting...';
    try {
        await api.get('/old-route');
    } catch (error) {
        console.error(error);
    }
});