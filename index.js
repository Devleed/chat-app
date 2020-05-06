const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.send('psshhh..!!');
});

app.listen(port, () => console.log(`listening on port ${port}`));
