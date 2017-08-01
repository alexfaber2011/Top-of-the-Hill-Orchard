const keystone = require('keystone');
const expect = require('chai').expect;
const _ = require('lodash');

const COLLECTION_NAME = 'postCategory'

const insertCategory = (name, keystone) => {
  const PostCageory = keystone.list('PostCategory');
  const newPostCategory = new PostCageory.model({ name });
  return new Promise((resolve, reject) => {
    newPostCategory.save(err => {
      if (err) {
        console.error('[insertCategory] unable to post category: ', err);
        reject();
      }
      resolve();
    })
  })
}

describe('Post Category Model', () => {
  before(() => {
    keystone.init({
      name: COLLECTION_NAME,
      port: 3001,
      'cloudinary config': {},   //must be configured
      'cookie secret': 'FOOBAR', //must be configured
    });
    keystone.import('../models');
    keystone.start();
  });

  after((done) => {
    // Drop test database
    mongo = keystone.get('mongo');
    const conn = keystone.mongoose.createConnection(mongo, (err) => {
        conn.db.dropDatabase(function(err) {
            conn.close(function(err) {
                if (err) {
                  console.error(`[AFTER ALL] ERROR: Unable to drop database: ${COLLECTION_NAME}`, err);
                }
                keystone.closeDatabaseConnection(done);
            });
        });
    });
  });

  it('should delete all all instances of a PostCategory in all Posts', () => {
    insertCategory('foobar')
      .then(() => {
        expect.fail();
      })
  })
})
