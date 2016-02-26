var octonode = require('octonode');


var github = octonode.client(nconf.get('GITHUB_TOKEN'));

module.exports = {
  match: function (event) {
    var repo = event.repository;
    var issue = event.issue;
    var comment = event.comment;

    return !!comment.body.match(/:shipit:/ig);
  },

  exec: function (event) {
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
  }
}
