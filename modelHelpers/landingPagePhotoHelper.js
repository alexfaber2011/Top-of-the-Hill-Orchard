const keystone = require('keystone');
const _ = require('lodash');

function getPhotos (state) {
	return new Promise((resolve, reject) => {
		keystone.list('LandingPagePhoto').model.find({ state })
			.exec((err, photos) => {
				err ? reject(err) : resolve(photos);
			});
	});
};

const photoNumToTitle = {
	1: 'Far-Left',
	2: 'Center-Left',
	3: 'Center-Right',
	4: 'Far-Right',
}

/**
 * bootstrapPhotos - checks to see if any photos are published and fills in the
 * ones that are not
 *
 * @return {Promise<Array<LandingPagePhoto>>}  returns a promise which resolves to an array of landing page photos
 */
function bootstrapPhotos () {
	return getPhotos('published')
		.then(photos => {
			const LandingPagePhoto = keystone.list('LandingPagePhoto');
			return Promise.all(_.reduce([1, 2, 3, 4], (acc, num) => {
				const existentPhoto = _.find(photos, ['number', num]);
				if (existentPhoto) {
					return acc;
				}

				const photo = new LandingPagePhoto.model({
					title: photoNumToTitle[num],
					state: 'published',
					number: num,
					image: {
						public_id: 'top-of-the-hill-orchard/landing-page-photos/image/lczsojs7e9ffu8wqxsn8',
						version: 1505141261,
						signature: '95c134c30986fa0cf1c2f23c3351331b45697aa5',
						width: 3264,
						height: 2448,
						format: 'jpg',
						resource_type: 'image',
						url: 'http://res.cloudinary.com/anzaborrego/image/upload/v1505141261/top-of-the-hill-orchard/landing-page-photos/image/lczsojs7e9ffu8wqxsn8.jpg',
						secure_url: 'https://res.cloudinary.com/anzaborrego/image/upload/v1505141261/top-of-the-hill-orchard/landing-page-photos/image/lczsojs7e9ffu8wqxsn8.jpg',
					},
				});
				return _.concat(acc, photo.save());
			}, []));
		});
}

module.exports = { getPhotos, bootstrapPhotos };
