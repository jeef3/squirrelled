# Squirrelled

Adds a `squirrelled` label to your Pull Requests when they receive a :shipit:.

## Installation

Make sure you have a `squirrelled` label already created for your repository.

### Heroku

Click the button!
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

### Manual

```
npm install squirrelled
npm start
```

## Configuration

Now you have the server running, you need to [set-up a webhook](https://developer.github.com/webhooks/).

Then, if using Heroku, you will need to set your config vars, with manual you can add a `.env` and put the vars in there:

 - `GITHUB_TOKEN` — Your API token
 - `GITHUB_SECRET` — The secret used for the web hooks.
