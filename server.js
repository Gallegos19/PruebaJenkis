const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString(), author: 'Gallegos' });
});

app.get('/hello', (_req, res) => {
  res.status(200).json({ message: 'Hello, world!', author: 'Fernanda' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Healthcheck service running on port ${PORT}`);
});
