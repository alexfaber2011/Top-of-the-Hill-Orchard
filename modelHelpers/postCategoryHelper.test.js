const keystone = require('keystone');
const pch = require('./postCategoryHelper');
const expect = require('chai').expect;

const COLLECTION_NAME = 'postCategoryHelper'

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

describe('Post Category Helper', () => {
  before(() => {
    // console.info('[BEFORE ALL] Initializing Keystone with: ', COLLECTION_NAME);
    keystone.init({
      name: COLLECTION_NAME,
      'cloudinary config': {},   //must be configured
      'cookie secret': 'FOOBAR', //must be configured
    });
    // Load your project's Models
    keystone.import('../models');
    keystone.start();
    // console.info('[BEFORE ALL] Successfully initialized Keystone');
  });

  after((done) => {
    // Drop test database
    mongo = keystone.get('mongo');
    // console.info('[AFTER ALL] dropping collection: ', COLLECTION_NAME);
    const conn = keystone.mongoose.createConnection(mongo, (err) => {
        conn.db.dropDatabase(function(err) {
            conn.close(function(err) {
                if (err) {
                  console.error('[AFTER ALL] ERROR: Unable to drop database: ', err);
                }
                // console.info('[AFTER ALL] successfully dropped collection: ', COLLECTION_NAME);
                done();
            });
        });
    });
  });

  it('should lists all of the categories', () => {
    return Promise.all([
      insertCategory('foo', keystone),
      insertCategory('bar', keystone),
      insertCategory('baz', keystone),
    ]).then(() => {
      return pch.getAllCategories()
        .then(categories => {
          expect(categories).to.have.lengthOf(3);
          return
        })
        .catch(err => {
          console.log('err: ', err);
          expect.fail();
          return
        })
    })
  })
})
