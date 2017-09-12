const cloudinary = require('cloudinary');

const CLOUD_NAME = 'anzaborrego';

cloudinary.config({ cloud_name: CLOUD_NAME });

/**
 * useExifAngle - generates a cloudinary url that uses the images EXIF angle
 *
 * @param  {string} cloudinaryUrl a cloudinary image url
 * @return {string}               a cloudinary image url
 */
function useExifAngle (cloudinaryUrl) {
	return cloudinary.url(cloudinaryUrl, { angle: 'exif' });
}

module.exports = { useExifAngle };
