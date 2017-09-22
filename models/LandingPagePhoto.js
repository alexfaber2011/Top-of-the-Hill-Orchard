var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Landing Page Photo Model
 * ==========
 */

var LandingPagePhoto = new keystone.List('LandingPagePhoto', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	nocreate: true,
	nodelete: true,
});

LandingPagePhoto.add({
	title: { type: String, required: true, noedit: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	image: { type: Types.CloudinaryImage },
	number: { type: Number, required: true, noedit: true, hidden: true, initial: 0 },
});

LandingPagePhoto.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
LandingPagePhoto.register();
