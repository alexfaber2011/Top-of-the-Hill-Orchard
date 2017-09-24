const keystone = require('keystone');
const { bootstrapPhotos } = require('./landingPagePhotoHelper');
const expect = require('chai').expect;
const _ = require('lodash');
const testUtility = require('../app.test.js');

function insertPhotos(photoNums) {
  const LandingPagePhoto = keystone.list('LandingPagePhoto');
  return Promise.all(_.map(photoNums, num => {
    return new Promise((resolve, reject) => {
      const newPhoto = new LandingPagePhoto.model({
        title: `foo-${num}`,
        state: 'published',
        number: num,
          "image" : {
          "public_id" : "top-of-the-hill-orchard/landing-page-photos/image/lczsojs7e9ffu8wqxsn8",
          "version" : 1505141261,
          "signature" : "95c134c30986fa0cf1c2f23c3351331b45697aa5",
          "width" : 3264,
          "height" : 2448,
          "format" : "jpg",
          "resource_type" : "image",
          "url" : "http://res.cloudinary.com/anzaborrego/image/upload/v1505141261/top-of-the-hill-orchard/landing-page-photos/image/lczsojs7e9ffu8wqxsn8.jpg",
          "secure_url" : "https://res.cloudinary.com/anzaborrego/image/upload/v1505141261/top-of-the-hill-orchard/landing-page-photos/image/lczsojs7e9ffu8wqxsn8.jpg"
        }
      });
      newPhoto.save(err => {
        if (err) {
          reject(err);
        } else {
          resolve(newPhoto);
        }
      });
    });
  }));
}

describe('Landing Page Photo Helper', () => {

  describe('bootstrapPhotos()', () => {

    afterEach(() => {
      testUtility.deleteAllDocuments('LandingPagePhoto', keystone);
    });

    it('should be defined', () => {
      expect(bootstrapPhotos).to.exist;
    });

    it('should add no photos when they all already exist', () => {
      return insertPhotos([1,2,3,4])
        .then(bootstrapPhotos)
        .then(photos => {
          expect(photos).to.be.empty;
        })
        .catch(err => {
          console.error('caught an unexpected error: ', err);
          expect.fail();
        })
    });

    it('should add all for photos when they do not exist', () => {
      return bootstrapPhotos()
        .then(photos => {
          expect(photos).to.have.lengthOf(4);
        })
        .catch(err => {
          console.error('caught an unexpected error: ', err);
          expect.fail();
        })
    });

    it('should add 1 photo when it does not exist', () => {
      return insertPhotos([1, 3, 4])
        .then(bootstrapPhotos)
        .then(photos => {
          expect(photos).to.have.lengthOf(1);
          expect(photos[0]).to.have.property('number', 2);
        })
        .catch(err => {
          console.error('caught an unexpected error: ', err);
          expect.fail();
        })
    })
  });
});
