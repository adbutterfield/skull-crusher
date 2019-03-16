const express = require('express');
const app = express();
const sassMiddleware = require('node-sass-middleware');
const path = require('path');

app.use(
  sassMiddleware({
    src: __dirname + '/public',
    dest: '/tmp'
  })
);

app.use(express.static('public'));
app.use('/assets', express.static('assets'));
app.use(express.static('/tmp'));

app.get('/favicon.ico', (req, res) => {
  return res.sendFile(path.join(__dirname, './assets/favicon.ico'));
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
