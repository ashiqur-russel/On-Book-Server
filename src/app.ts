import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

export default app;
