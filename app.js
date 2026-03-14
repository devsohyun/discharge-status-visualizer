import express from 'express';

const app = express();
const PORT = 3000;

// Serve files from /public at the site root /
app.use(express.static('public'));

// Test route: visit http://localhost:3000/ping
app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
