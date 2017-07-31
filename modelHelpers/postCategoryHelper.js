const keystone = require('keystone');

const pch = {
	getAllCategories: () => {
		return new Promise((resolve, reject) => {
			keystone.list('PostCategory').model.find().sort('name').exec((err, results) => {
				if (err) {
					console.log(err);
					reject(err);
				}
				console.log(results);
				resolve(results);
			});
		});
	},
};

module.exports = pch;
