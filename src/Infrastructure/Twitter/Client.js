const parameters = require('../../parameters');
const OAuth = require('oauth');

class Client {
    constructor(
        appAccessToken = parameters.twitter_application_consumer_key,
        appSecret = parameters.twitter_application_secret,
        userAccesstoken = parameters.twitter_user_access_token,
        userSecret = parameters.twitter_user_secret,
    ) {
        this.oAuthClient = new OAuth.OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            appAccessToken,
            appSecret,
            '1.0A',
            null,
            'HMAC-SHA1'
        );

        this.userAccessToken = userAccesstoken;
        this.userSecret = userSecret;
    }

    async postTweet(text) {
        let lastTweetId = null;
        for (let tweet of this.getAdjustedTweetList(text)) {
            const tweetId = await this.sendTweetChunk(tweet, lastTweetId);
            console.log('TWEET ID', tweetId);
            lastTweetId = tweetId || null;
        }
    }

    async sendTweetChunk(tweetText, lastTweetId) {
        return new Promise(async (resolve, reject) => {
            const tweetData = {
                'status': tweetText,
                ...(lastTweetId && {in_reply_to_status_id: lastTweetId.toString()})
            };

            console.log(tweetData);

            this.oAuthClient.post('https://api.twitter.com/1.1/statuses/update.json',
                this.userAccessToken,  // oauth_token (user access token)
                this.userSecret,  // oauth_secret (user secret)
                tweetData,
                '',
                (error, data, response) => {
                    if (error) {
                        reject(error);
                    }

                    const parsedData = JSON.parse(data);
                    console.log(parsedData);

                    resolve(parsedData.id_str);
                }
            );
        })
    }

    getAdjustedTweetList(text) {

        if (text.length <= 140) {
            return [text];
        }

        return this.breakLongTweetIntoSmallerSeparateTweets(text);

    }

    breakLongTweetIntoSmallerSeparateTweets(tweet) {
        let splitBySpaced = tweet.split(' ');
        const tweetList = [];
        let currentTweet = '';

        for (let text of splitBySpaced) {
            if (currentTweet.length < 140 && (currentTweet.length + (text.length + 1)) <= 140) {
                currentTweet += text + ' ';
            } else {
                tweetList.push(currentTweet);
                currentTweet = text;
            }
        }

        if (currentTweet) {
            tweetList.push(currentTweet);
        }

        return tweetList;
    }
}


module.exports = Client;
