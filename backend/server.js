const express = require('express');
const cors = require('cors');
const path = require('path');

const infoRouter = require('./routes/info');
const downloadRouter = require('./routes/download');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

app.use('/api/info', infoRouter);
app.use('/api/download', downloadRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
