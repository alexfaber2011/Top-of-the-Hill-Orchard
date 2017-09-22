// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'Top of the Hill Orchard',
	'brand': 'Top of the Hill Orchard',
	'port': process.env.NODE_ENV !== 'production' ? 3000 : process.env.PORT,

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',

	'mongo': process.env.MONGO_URI || "mongodb://localhost/top-of-the-hill-orchard",

	'cloudinary config': {
		cloud_name: 'anzaborrego',
		api_key: process.env.CLOUDINARY_API_KEY_ANZABORREGO,
		api_secret: process.env.CLOUDINARY_API_SECRET_ANZABORREGO,
	},
	'cloudinary prefix': 'top-of-the-hill-orchard',
	'cloudinary folders': true,
	'cloudinary secure': true,

	'cookie secret': process.env.TOP_OF_THE_HILL_ORCHARD_COOKIE_SECRET,
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure how the session is stored if we're in production
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
	keystone.set('session store', 'mongo');
}

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	'posts': ['posts', 'post-categories'],
	'users': 'users',
	'Home Page Photos': 'landing-page-photos',
});

// Start Keystone to connect to your database and initialise the web server


if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
	+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
	+ '\n----------------------------------------'
	+ '\nYou have opted into email sending but have not provided'
	+ '\nmailgun credentials. Attempts to send will fail.'
	+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
	+ '\nset up your mailgun integration');
}


keystone.start();

// Bootstrap stuff
const { bootstrapPhotos } = require('./modelHelpers/landingPagePhotoHelper');
bootstrapPhotos();
