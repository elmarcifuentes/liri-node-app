// NPM install, save dependencies to package.json --save command
// Twitter and Spotify
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// Require fs Node package
var fs = require("fs");

// Axios Require to grab data from the OMDB API.
var axios = require("axios");

// Require keys.js that contains Twitter API keys
var keys = require("./keys.js");

// Spotify Keys - NOTE: explore adding it to keys.js
var spotify = new Spotify({
    id: "c2a67a2ee68a40d4be37ff903dff1e56",
    secret: "3b455c214a214545bda3e49765ba5d16",
});
//=================================

// process.argv
var nodeArgv = process.argv;
var command = process.argv[2];
//=================================


//read twitter access keys
//=================================
var twitterConsummerKey = keys.consumer_key;
var twitterConsumerSecret = keys.consumer_secret;
var twitterAccessToken = keys.access_token_key;
var twitterAccessSecret = keys.access_token_secret;

var client = new Twitter({
    consumer_key: twitterConsummerKey,
    consumer_secret: twitterConsumerSecret,
    access_token_key: twitterAccessToken,
    access_token_secret: twitterAccessSecret
});
//=================================


// TWITTER FUNCTION
// node liri.js my-tweets
// This will show your last 20 tweets and when they were created at in your terminal/bash window.
function twitterFunc() {
    var params = { screen_name: 'elmand27', count: 20 };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(tweets);
        }
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].created_at + tweets[i].text);
        }
    });
};
//=================================


// OMDB FUNCTION
// node liri.js movie-this '<movie name here>'
// This will output title, year, IMDB rating, Rotten Tomatoes Rating, Country, Language, Plot, and Actors in the movie.
function omdbFunc() {
    var movieName = "";
    for (var i = 3; i < nodeArgv.length; i++) {
        movieName = movieName + nodeArgv[i] + " ";
    }
    if (movieName === "") {
        movieName = "scarface";
    };

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece"
    console.log(queryUrl);
    axios.get(queryUrl)
        .then(function(response) {
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        })
        .catch(function(error) {
            console.log(error);
        })
};
//=================================


// Spotify function
// node liri.js spotify-this-song '<song name here>'
// This will show the artist, song name, preview link, and the album of the song in your terminal/bash window.
function spotifyFunc() {
    var songName = "";
    for (var i = 3; i < nodeArgv.length; i++) {
        songName = songName + nodeArgv[i] + " ";
    }
    if (songName === "") {
        songName = "I Want it That Way";
    };

    spotify.search({ type: 'track', query: songName, limit: 1 }, function(error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
}
//=================================


// fs FUNCTION
// node liri.js do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
function fsFunc() {
    fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        //seperate string by comma and store into data array
        var data = data.split(",");
        command = data[0];
        songName = data[1];
        spotifyFunc();
    });
}
//=================================


// LIRI FUNCTION
function liriFunc() {
    if (command === "my-tweets") {
        twitterFunc();
    } else if (command === "movie-this") {
        omdbFunc();
    } else if (command === "spotify-this-song") {
        spotifyFunc();
    } else if (command === "do-what-it-says") {
        fsFunc();
    }
};
//=================================


//INITIALIZE FUNCTION
liriFunc();