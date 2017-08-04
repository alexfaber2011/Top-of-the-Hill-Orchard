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

  it('should retreive all 3 published posts', () => {
    return Promise.all([
      testUtility.insertPost({title: 'foo', state: 'published'}, keystone),
      testUtility.insertPost({title: 'bar', state: 'published'}, keystone),
      testUtility.insertPost({title: 'baz', state: 'published'}, keystone),
    ]).then(() => {
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

  it('should return the first 10 published posts (when the collection has 13)', () => {
    return Promise.all([
      testUtility.insertPost({title: 'foo', state: 'published'}, keystone),
      testUtility.insertPost({title: 'bar', state: 'published'}, keystone),
      testUtility.insertPost({title: 'baz', state: 'published'}, keystone),
      testUtility.insertPost({title: 'a', state: 'published'}, keystone),
      testUtility.insertPost({title: 'b', state: 'published'}, keystone),
      testUtility.insertPost({title: 'c', state: 'published'}, keystone),
      testUtility.insertPost({title: 'd', state: 'published'}, keystone),
      testUtility.insertPost({title: 'e', state: 'published'}, keystone),
      testUtility.insertPost({title: 'f', state: 'published'}, keystone),
      testUtility.insertPost({title: 'g', state: 'published'}, keystone),
      testUtility.insertPost({title: 'h', state: 'published'}, keystone),
      testUtility.insertPost({title: 'i', state: 'published'}, keystone),
      testUtility.insertPost({title: 'j', state: 'published'}, keystone),
    ]).then(() => {
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
  })
});
