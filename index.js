var crypto = require('crypto');

var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var nconf = require('nconf');

var middleware = [require('./shipit')];

dotenv.load();
nconf
  .env()
  .argv()
  .defaults({
    PORT: 3000
  });


var app = express();
app.use(bodyParser.text({ type: 'application/json' }));

app.post('/issue-comment', function (req, res) {
  var suppliedSignature = req.get('X-Hub-Signature');

  var expectedSignature = 'sha1=' + crypto
    .createHmac('sha1', nconf.get('GITHUB_SECRET'))
    .update(req.body)
    .digest('hex');

  console.log('Issue comment event received');
  console.log('Comparing keys:');
  console.log(suppliedSignature);
  console.log(expectedSignature);

  if (suppliedSignature !== expectedSignature) {
    res.sendStatus(404);
    return;
  }

  res.sendStatus(200);

  var event = JSON.parse(req.body);

  middleware
    .filter(function (m) { return m.match(event) })
    .forEach(function (m) { return m.exec(event) });
});

app.get('/', function (req, res) {
  res.send('Squirrelled!');
});

var server = app.listen(nconf.get('PORT'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Squirrelled listening at http://%s:%s', host, port);
});
