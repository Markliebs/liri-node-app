//allows access to the key.js file
const twitterKeys = require('./keys.js');

//allows access to the file system
var fs = require('fs');

//allows access to utils for coloring text 
var utils = require('util');

//placeholder value
const twitter = require('twitter');

//builds twitter object with keys to make calls
const tweets = new twitter(twitterKeys.twitterKeys);

//search parameter object
var twitterSearchParam = {
	screen_name: 'markliebs',
	count: 20,
}

//general request variable
var request = require('request');

//sets variable for arguments
var command = process.argv[2];

//sets variable to have access to all other inputs as a parameter to the queries
var parameter = process.argv.slice(3).join('+');

//function for writing to txt.log
function writeToLog(textParam) {
	//appends file
	fs.appendFile('log.txt', textParam, function (err) {
		//checks for errors and prints them if there are any
		if (err) {
			return console.log(err);
		};
		//informs user that log was updated
		utils.inspect.styles.string = 'yellow';
		console.log('log.txt was updated');
	});
};

//controls what wappens based on user input
switch (command) {
	case 'my-tweets':
		getMyTweets();
		break;
	case 'spotify-this-song':

		getMusicInfo(parameter);
		break;
	case 'movie-this':

		getMovieInfo(parameter);
		break;
	default:
		console.log('That command was not recognized. Please try again.');
};

//placeholder variable for log.txt
var writeableObj = "";

//function calls for cases 

//twitter function gets last 20 tweets from user
function getMyTweets() {
	tweets.get('statuses/user_timeline', twitterSearchParam, function (err, response) {
		//logs any errors, if any
		if (err) {
			console.log(err);
		};
		//console.log(response);
		console.log('This is my last ' + response.length + ' tweets.')
		//returns info in an array
		for (var i = 0; i < response.length; i++) {
			//logs tweet message and creation date
			console.log('#' + (i + 1) + ": " + response[i].text);
			console.log('Posted on: ' + response[i].created_at);
			//builds string to be written to log.txt
			writeableObj += ', ' + '#' + (i + 1) + ": " + response[i].text + response[i].created_at;
		};
		//adds command to beginning of string
		writeableObj = command + "" + writeableObj + "\n";
		//writes to log.txt
		writeToLog(writeableObj);
	});
};

//spotify function returns first match spotify finds to song parameter
function getMusicInfo(parameter) {
	//covers case of no parameter entered after command
	if (!parameter) {
		parameter = "evenflow";
	};

	//api query url for request, limits parameter search to trrack and limit of 1 song return
	var queryUrl = 'https://api.spotify.com/v1/search?query=' + parameter + '&limit=1&type=track';

	//runs call to api
	request(queryUrl, function (err, response, body) {
		//logs errors if any
		if (err) {
			console.log(err);
		};
		//formats information received and prints to console
		body = JSON.parse(body);
		utils.inspect.styles.string = 'cyan';
		console.dir('You Chose...wisely:', { colors: true })
		utils.inspect.styles.string = 'yellow';
		console.dir('Artist(s): ' + body.tracks.items[0].artists[0].name, { colors: true });
		utils.inspect.styles.string = 'green';
		console.dir('Album Name: ' + body.tracks.items[0].album.name, { colors: true });
		utils.inspect.styles.string = 'yellow';
		console.dir('Song Title: ' + body.tracks.items[0].name, { colors: true });
		utils.inspect.styles.string = 'green';
		console.dir('Preview Link: ' + body.tracks.items[0].preview_url, { colors: true });

		//writes query request and response to log.txt
		writeableObj = command + ", " + parameter + ", " + body.tracks.items[0].artists[0].name + ", " + body.tracks.items[0].name + ", " + body.tracks.items[0].preview_url + ", " + body.tracks.items[0].album.name + "\n";

		//writes to log.txt
		writeToLog(writeableObj);
	});
};

//OMDB function
function getMovieInfo(parameter) {
	//runs if no parameter typed
	if (!parameter) {
		parameter = 'frozen';
	};
	//builds url for response
	var queryUrl = 'http://www.omdbapi.com/?t=' + parameter + '&y=&plot=short&r=json&tomatoes=true';
	//call request to omdb api
	request(queryUrl, function (err, response, body) {
		//console logs error if any
		if (err) {
			console.log(err);
		}
		//turns response into JSON object, and prints to console
		body = JSON.parse(body);
		utils.inspect.styles.string = 'cyan';
		console.dir('A fine movie indeed:', { colors: true });
		utils.inspect.styles.string = 'yellow';
		console.dir('Title: ' + body.Title, { colors: true });
		utils.inspect.styles.string = 'green';
		console.dir('Release Year: ' + body.Year, { colors: true });
		utils.inspect.styles.string = 'yellow';
		console.dir('IMDB Rating: ' + body.imdbRating, { colors: true });
		utils.inspect.styles.string = 'green';
		console.dir('Country: ' + body.Country, { colors: true });
		utils.inspect.styles.string = 'yellow';
		console.dir('Language: ' + body.Language, { colors: true });
		utils.inspect.styles.string = 'green';
		console.dir('Plot: ' + body.Plot, { colors: true });
		utils.inspect.styles.string = 'yellow';
		console.dir('Actors: ' + body.Actors, { colors: true });
		utils.inspect.styles.string = 'green';
		console.dir('Rotten Tomatoes Rating: ' + body.tomatoRating, { colors: true });
		utils.inspect.styles.string = 'yellow';
		console.dir('Rotten Tomatoes URL: ' + body.tomatoURL, { colors: true });

		//writes query request and response to log.txt
		writeableObj = command + ", " + parameter + ", " + body.Title + ", " + body.Year + ", " + body.imdbRating + ", " + body.Country + ", " + body.Language + ", " + body.Plot + ", " + body.Actors + ", " + body.tomatoRating + ", " + body.tomatoURL + "\n";

		//writes to log.txt
		writeToLog(writeableObj);
	});
};


// ignore this