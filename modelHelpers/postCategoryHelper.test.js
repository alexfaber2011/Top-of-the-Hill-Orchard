const keystone = require('keystone');
const pch = require('./postCategoryHelper');

const COLLECTION_NAME = 'postCategoryHelper'

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
    pch.getAllCategories()
      .then(categories => {
        console.log(categories);
      })
      .catch(err => {
        console.log('err: ', err);
      })
  })
})
