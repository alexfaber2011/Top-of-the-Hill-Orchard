const keystone = require('keystone');
const expect = require('chai').expect;
const _ = require('lodash');
const testUtility = require('../app.test.js');

describe('Post Category Model', () => {
  afterEach(() => {
    testUtility.deleteAllDocuments('Post', keystone);
    testUtility.deleteAllDocuments('PostCategory', keystone);
  });

  it('should delete the instance of a PostCategory in one Posts', () => {
    return testUtility.insertCategory('foobar', keystone)
      .then((category) => {
        return testUtility.insertPost({title: 'fooPost', categories: [category._id]}, keystone)
          .then((post) => {
            return { post, category };
          });
      })
      .then(({ post, category }) => {
        return new Promise((resolve, reject) => {
          keystone.list('PostCategory').model
            .findById(category._id)
            .exec((err, postCategory) => {
              if (err) {
                reject(err);
              } else {
                postCategory.remove();
                resolve({ post, category });
              }
            });
        });
      })
      .then(({ post, category }) => {
        return new Promise((resolve, reject) => {
          keystone.list('Post').model
            .find()
            .exec((err, posts) => {
              if (err) {
                expect.fail('failed to fetch all the posts');
                reject(err);
              } else {
                const idVanquished = _.every(posts, (post) => {
                  return _.indexOf(post.categories, category._id) == -1;
                })
                expect(idVanquished).to.be.true;
                resolve();
              }
            });
        });
      });
  });

  it('should delete both instances of a category in mutiple posts, other bits of data intact', () => {
    const EXTRANEOUS_ID = '5983f25b0a50ae2f34258d1a';

    return Promise.all([
      testUtility.insertCategory('foobar', keystone),
      testUtility.insertCategory('baz', keystone),
    ])
    .then(([cat1, cat2]) => {
      return Promise.all([
        testUtility.insertPost({title: 'fooPost', categories: [cat1._id, EXTRANEOUS_ID]}, keystone),
        testUtility.insertPost({title: 'bazPost', categories: [cat2._id, EXTRANEOUS_ID]}, keystone),
        testUtility.insertPost({title: 'barPost', categories: [EXTRANEOUS_ID]}, keystone),
      ])
      .then(([post1, post2, post3]) => {
        return { cat1, cat2, post1, post2, post3 };
      });
    })
    .then(({ cat1, cat2, post1, post2, post3 }) => {
      return new Promise((resolve, reject) => {
        keystone.list('PostCategory').model
          .findById(cat1._id)
          .exec((err, postCategory) => {
            if (err) {
              reject(err);
            } else {
              postCategory.remove();
              resolve({ cat1, cat2, post1, post2, post3 });
            }
          });
      });
    })
    .then(({ cat1, cat2, post1, post2, post3 }) => {
      return new Promise((resolve, reject) => {
        keystone.list('PostCategory').model
          .findById(cat2._id)
          .exec((err, postCategory) => {
            if (err) {
              reject(err);
            } else {
              postCategory.remove();
              resolve();
            }
          });
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        keystone.list('Post').model
          .find()
          .exec((err, posts) => {
            if (err) {
              expect.fail('failed to fetch all the posts');
              reject(err);
            } else {
              const allTrue = _.every(posts, (post) => {
                return post.categories.length == 1;
              })
              expect(allTrue).to.be.true;
              resolve();
            }
          });
      });
    })
    .catch(err => {
      console.log('err: ', err);
      expect.fail('caught an error');
    })
  });
});
