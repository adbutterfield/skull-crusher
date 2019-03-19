const express = require('express');
const app = express();

app.use(express.static('dist'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});
app.use((req, res) => {
  res.redirect('/');
});

var listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
