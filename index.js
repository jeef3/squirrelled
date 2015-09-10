var express = require('express');
var octonode = require('octonode');
var dotenv = require('dotenv');
var nconf = require('nconf');

dotenv.load();
nconf
  .argv()
  .env();

var app = express();
var github = octonode.client(nconf.get('GITHUB_TOKEN'));

var issue = github.issue('', 0);

issue.comments(function (err, comments) {
  var result = comments.filter(function (comment) {
    return comment.body.match(/:shipit:/ig);
  });

  var canShipIt = !!result.length;

  if (!canShipIt) { return; }

  issue.info(function (err, info) {
    var labels = info.labels.map(function (label) {
      return label.name;
    });

    if (labels.indexOf('squirrelled') === -1) {
      labels.push('squirrelled');
    }

    issue.update({
      labels: labels
    }, function () {});
  })
});
// app.get('/github', function (req, res) {
//   res.send(200);
// });
