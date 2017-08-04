var keystone = require('keystone');
const { ObjectId } = require('mongodb');

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

PostCategory.schema.pre('remove', function (next) {
	const Post = keystone.list('Post');
	const category = this;
	Post.model.collection
		.updateMany(
			{ categories: { $in: [ObjectId(category._id)] } },
			{ $pullAll: { categories: [ObjectId(category._id)] } },
			next);
});

PostCategory.relationship({ ref: 'Post', path: 'posts', refPath: 'categories' });

PostCategory.register();
