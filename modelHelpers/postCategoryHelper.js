const keystone = require('keystone');

const getCategoryById = (categoryId) => {
	return new Promise((resolve, reject) => {
		keystone.list('PostCategory').model.findById(categoryId)
			.exec((err, category) => {
				err ? reject(err) : resolve(category);
			});
	});
}

const getAllCategories = () => {
	return new Promise((resolve, reject) => {
		keystone.list('PostCategory').model.find().sort('name').exec((err, results) => {
			if (err) {
				reject(err);
			}
			resolve(results);
		});
	});
};

module.exports = { getAllCategories, getCategoryById };
