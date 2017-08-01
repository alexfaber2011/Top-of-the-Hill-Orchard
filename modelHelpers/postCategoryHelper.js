const keystone = require('keystone');

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

module.exports = { getAllCategories };
