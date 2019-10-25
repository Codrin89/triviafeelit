var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var S3Adapter = require('parse-server').S3Adapter;
var path = require('path');
var bodyParser = require('body-parser');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
	console.log('DATABASE_URI not specified, falling back to localhost.');
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var api = new ParseServer({
	//**** General Settings ****//
	databaseURI: databaseUri || 'mongodb://localhost:27017/parse_demo',
	cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
	serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
	
	//**** Security Settings ****//
	// allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || false, 
	appId: 'myAppId',
	masterKey: 'myMasterKey', //Add your master key here. Keep it secret!
	//**** Email Verification ****//
	/* Enable email verification */
	// verifyUserEmails: true,
	/* The public URL of your app */
	// This will appear in the link that is used to verify email addresses and reset passwords.
	/* Set the mount path as it is in serverURL */
	// publicServerURL: 'http://localhost:1337/parse',
	/* This will appear in the subject and body of the emails that are sent */
	appName: process.env.APP_NAME || "AcPearlHoliday", 
	// emailAdapter: {
	// 	module: 'parse-server-simple-mailgun-adapter',
	// 	options: {
	// 		fromAddress: process.env.EMAIL_FROM || "test@example.com",
	// 		domain: process.env.MAILGUN_DOMAIN || "example.com",
	// 		apiKey: process.env.MAILGUN_API_KEY  || "apikey"
	// 	}
	// },
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();
 
// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
  }));
app.use(bodyParser.json());       // to support JSON-encoded bodies

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/test.html'));
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/templates/index.html'));
});

app.get('/search', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/templates/search.html'));
});

app.get('/listings/:id', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/ListingsUI.html'));
});

app.get('/admin/listings/add', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/ListingsPost.html'));
});

app.get('/admin/listings/view', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/ListingsView.html'));
});

app.get('/admin/listings/photos/:id', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/ListingsViewExtended.html'));
});

app.get('/admin/listings/calendar/:id', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/ListingCalendar.html'));
});

app.get('/holiday_apartaments', function (req, res) {
	res.sendFile(path.join(__dirname, '/public/templates/holidayApartaments.html'));
});

app.post('/admin/listings/uploadMedia', async (req, res) => {
	const {uploadedPhoto, objectId, groupName} = req.body;
	if(!uploadedPhoto || !objectId || !groupName) {
		res.status(400).send({response: 'Incomplete data'});
	}
	const Listings = new Parse.Object.extend('Listings');
	const query = new Parse.Query(Listings);
	query.equalTo("objectId", objectId);
	query.first().then(listings => {
		let photosData = listings.get('photos');
		if(!photosData) {
			photosData = {};
			photosData[groupName] = [];
		} else if(!photosData[groupName]) {
			photosData[groupName] = [];
		}
		for(let i = 0; i < uploadedPhoto.length; i++) {
			photosData[groupName].push(uploadedPhoto[i]);
		}
		listings.save().then(response => {
			res.status(200).send(response);
		}, error => {
			res.status(400).send({response: 'Could not save data'});
		});
	}, error => {
		console.log(error);
		res.status(400).send({response: 'Could not retrive data'});
	});
	
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
	console.log('parse-server-example running on port ' + port + '.');
});


// This will enable the Live Query real-time server
// ParseServer.createLiveQueryServer(httpServer);