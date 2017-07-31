var keystone = require('keystone');
let Post = keystone.list('Post');

/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

PostCategory.add({
	name: { type: String, required: true },
});

PostCategory.schema.pre('remove', (next) => {
	console.log('[remove hook]');
	const category = this;
	Post.model.updateMany(
		{ categories: { $in: [category._id] } },
		{ $pullAll: { categories: [category._id] } },
		next
	);
});

PostCategory.relationship({ ref: 'Post', path: 'posts', refPath: 'categories' });

PostCategory.register();
