var express = require('express');
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

var app = express();

app.post('/issue-comment', function (req, res) {
  res.send(200);
});

app.get('/', function (req, res) {
  res.send('Squirrelled!');
});

var server = app.listen(nconf.get('PORT'), function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Squirrelled listening at http://%s:%s', host, port);
});

var github = octonode.client(nconf.get('GITHUB_TOKEN'));

// var issue = github.issue('', 0);

// issue.comments(function (err, comments) {
//   var result = comments.filter(function (comment) {
//     return comment.body.match(/:shipit:/ig);
//   });

//   var canShipIt = !!result.length;

//   if (!canShipIt) { return; }

//   issue.info(function (err, info) {
//     var labels = info.labels.map(function (label) {
//       return label.name;
//     });

//     if (labels.indexOf('squirrelled') === -1) {
//       labels.push('squirrelled');
//     }

//     issue.update({
//       labels: labels
//     }, function () {});
//   })
// });
