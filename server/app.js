const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Redirect route
app.get('/old-route', (req, res) => {
    res.status(302).json({ message: 'Redirecting...', redirectTo: '/new-route' });
});

// New route
app.get('/new-route', (req, res) => {
    res.json({ message: 'You have been redirected to the new route!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});