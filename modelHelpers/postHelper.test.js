const keystone = require('keystone');
const expect = require('chai').expect;
const _ = require('lodash');
const testUtility = require('../app.test.js');
const postHelper = require('./postHelper');

describe('Post Helper', () => {
  afterEach(() => {
    testUtility.deleteAllDocuments('Post', keystone);
    testUtility.deleteAllDocuments('PostCategory', keystone);
  });

  it('should retreive all 3 posts', () => {
    return testUtility.insertNPosts(3, null, keystone).then(() => {
      return postHelper.getPage()
        .then((paginationResponse) => {
          expect(paginationResponse.total).to.equal(3);
          expect(paginationResponse.results).to.have.lengthOf(3);
        })
        .catch((err) => {
          console.log(err);
          expect.fail('catch block was called');
        })
    });
  });

  it('should return the first 10 posts (when the collection has 13)', () => {
    return testUtility.insertNPosts(13, null, keystone)
      .then(() => {
        return postHelper.getPage()
          .then((paginationResponse) => {
            expect(paginationResponse.total).to.equal(13);
            expect(paginationResponse.results).to.have.lengthOf(10);
          })
          .catch((err) => {
            console.log(err);
            expect.fail('catch block was called');
          })
    });
  });

  it('should return the first 10 published posts (when the collection has 23 total posts)', () => {
    return testUtility.insertNPosts(13, {state: 'published'}, keystone)
      .then(testUtility.insertNPosts(10, null, keystone))
      .then(() => {
        return postHelper.getPage(1, 10, null, 'published')
          .then((paginationResponse) => {
            expect(paginationResponse.total).to.equal(23);
            expect(paginationResponse.results).to.have.lengthOf(10);
            expect(paginationResponse.totalPages).to.equal(3);  //This seems a little fishy
          })
          .catch((err) => {
            console.log(err);
            expect.fail('catch block was called');
          })
      });
  });

  it('should return the first 7 published posts with the category of "Recipe"', () => {
    return testUtility.insertCategory('Recipe', keystone)
      .then((category) => {
        return testUtility.insertNPosts(25, {categories: [category._id]}, keystone)
          .then(() => {
            return category
          })
      })
      .then((category) => {
        return postHelper.getPage(1, 7, category._id)
          .then((paginationResponse) => {
            console.log(paginationResponse);
            expect(paginationResponse.total).to.equal(25);
            expect(paginationResponse.results).to.have.lengthOf(7);
          });
      });
  });
});
