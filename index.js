const fs = require('fs');



const tweetText = fs.readFileSync('./tweet.txt', {encoding: 'utf8'})

const TwitterClient =  require('./src/Infrastructure/Twitter/Client');
const client = new TwitterClient();

client.postTweet(tweetText, process.argv.includes('-dr'));
