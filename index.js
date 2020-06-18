const sensitive_data = require("./sensitive_data");

const OAuth = require('oauth');
const fs = require('fs');
const tweetText = fs.readFileSync('./tweet.txt', {encoding: 'utf8'})


const {
    twitter_application_consumer_key,
    twitter_application_secret,
    twitter_user_access_token,
    twitter_user_secret,
} = sensitive_data;

const oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    twitter_application_consumer_key,
    twitter_application_secret,
    '1.0A',
    null,
    'HMAC-SHA1'
);


const postBody = {
    'status': tweetText
};

// console.log('Ready to Tweet article:\n\t', postBody.status);
oauth.post('https://api.twitter.com/1.1/statuses/update.json',
    twitter_user_access_token,  // oauth_token (user access token)
    twitter_user_secret,  // oauth_secret (user secret)
    postBody,  // post body
    '',  // post content type ?
    function (err, data, res) {
        if (err) {
            console.log(JSON.stringify(err));
        } else {
            console.log('Success! Tweet posted.')
            console.log(JSON.stringify(data));
        }
    });
