const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Twitter Contract", function() {
	let Twitter;
	let twitter;
	let author;

	const otherTweets = 5;
	const myTweets = 3;

	let totalTweets;
	let totalMyTweets;

	beforeEach(async function() {
		Twitter = await ethers.getContractFactory("TContract");
		[author, addr1, addr2] = await ethers.getSigners();
		twitter = await Twitter.deploy();

		totalTweets = [];
		totalMyTweets = [];

		for(let i=0; i<otherTweets; i++) {
			let tweet = {
				'tweetContent': 'EPITA is the best' + i,
				'tweetAuthor': addr1,
				'deleteStatus': false 
			};

			await twitter.connect(addr1).addTweet(tweet.tweetContent, tweet.deleteStatus);
			totalTweets.push(tweet);
		}

		for(let i=0; i<myTweets; i++) {
			let tweet = {
				'tweetAuthor': author,
				'tweetContent': 'Today is a sunny day' + (otherTweets+i),
				'deleteStatus': false 
			};

			await twitter.addTweet(tweet.tweetContent, tweet.deleteStatus);
			totalTweets.push(tweet);
			totalMyTweets.push(tweet);
		}
	});

	describe("ADD TWEET FUNCTION", function() {
		it("TweetAdd functionality check", async function() {
			let tweet = {
				'tweetContent': 'This is a new tweet. Welcome',
				'deleteStatus': false 
			};

			await expect(await twitter.addTweet(tweet.tweetContent, tweet.deleteStatus))
            .to.emit(twitter, 'TweetAdd').withArgs(author.address, otherTweets+
                myTweets)
		})
	});
	

	describe("GET TWEET FUNCTION", function() {
		it("total tweets functionality check", async function() {
			const tweetsFromChain = await twitter.getAllTweets();
			expect(tweetsFromChain.length).to.equal(otherTweets+myTweets);
		})

		it("my tweets functionality check", async function() {
			const myTweetsFromChain = await twitter.getMyTweets();
			expect(myTweetsFromChain.length).to.equal(myTweets);
		})
	});
});