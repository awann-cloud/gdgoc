require('dotenv').config();
const express = require('express');

console.log('Creating Express app...');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

console.log(`Attempting to listen on port ${PORT}...`);
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});

console.log('Script continues running...');
