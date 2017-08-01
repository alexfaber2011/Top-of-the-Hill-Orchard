const keystone = require('keystone');

const COLLECTION_NAME = 'postCategoryHelper'

before(() => {
  // console.info('[BEFORE ALL] Initializing Keystone with: ', COLLECTION_NAME);
  keystone.init({
    name: COLLECTION_NAME,
    port: 3001,
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
              keystone.closeDatabaseConnection();
              const server = keystone.app.listen(process.env.PORT || 3001);
              server.close();
              done();
          });
      });
  });
});

function insertCategory (name, keystone) {
  const PostCageory = keystone.list('PostCategory');
  const newPostCategory = new PostCageory.model({ name });
  return new Promise((resolve, reject) => {
    newPostCategory.save(err => {
      if (err) {
        console.error('[insertCategory] unable to post category: ', err);
        reject();
      }
      resolve();
    });
  });
};

module.exports = { insertCategory };
