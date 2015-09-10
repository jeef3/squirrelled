var crypto = require('crypto');

var express = require('express');
var bodyParser = require('body-parser');
var octonode = require('octonode');
var dotenv = require('dotenv');
var nconf = require('nconf');

dotenv.load();
nconf
  .env()
  .argv()
  .defaults({
    PORT: 3000
  });

var github = octonode.client(nconf.get('GITHUB_TOKEN'));

var app = express();
app.use(bodyParser.json());

app.post('/issue-comment', function (req, res) {
  var supplied = req.headers['X-Hub-Signature']

  var calc = crypto
    .createHmac('sha1', nconf.get('GITHUB_SECRET'))
    .update(JSON.stringify(req.body))
    .digest('hex');

  console.log('Issue comment event received');
  console.log('Comparing keys:');
  console.log(supplier);
  console.log(calc);

  if (supplied !== calc) {
    res.sendStatus(404);
    return;
  }

  res.sendStatus(200);


  var event = req.body;

  var repo = event.repository;
  var issue = event.issue;
  var comment = event.comment;

  console.log('Comment body:', comment.body);

  var shipIt = !!comment.body.match(/:shipit:/ig);

  if (!shipIt) {
    console.log('No ship');
    return;
  }

  console.log('Ship it!');

  var ghissue = github.issue(repo.full_name, issue.number);
  var labels = issue.labels.map(function (label) {
    return label.name;
  });

  if (labels.indexOf('squirrelled') === -1) {
    labels.push('squirrelled');
  }

  console.log('Updating issue labels');
  ghissue.update({
    labels: labels
  }, function () {});
});

app.get('/', function (req, res) {
  res.send('Squirrelled!');
});

var server = app.listen(nconf.get('PORT'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Squirrelled listening at http://%s:%s', host, port);
});
