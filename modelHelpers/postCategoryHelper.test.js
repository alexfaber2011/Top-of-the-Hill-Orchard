const keystone = require('keystone');
const { getCategory,
        getAllCategories, } = require('./postCategoryHelper');
const expect = require('chai').expect;
const _ = require('lodash');
const testUtility = require('../app.test.js');

describe('Post Category Helper', () => {

  describe('getCategory()', () => {

    afterEach(() => {
      testUtility.deleteAllDocuments('Post', keystone);
      testUtility.deleteAllDocuments('PostCategory', keystone);
    });

    it('should return a the category', () => {
      return testUtility.insertCategory('foo', keystone)
        .then((category) => {
          return getCategory({_id: category._id});
        })
        .then((category) => {
          expect(category.name).to.equal('foo');
          return
        })
        .catch((err) => {
          console.log('err: ', err);
          expect.fail('catch block was called');
          return
        });
    });

    it('should return null if the category doesn\'t exist', () => {
      return getCategory({name: 'foo'})
        .then((category) => {
          expect(category).to.be.null;
          return
        })
        .catch((err) => {
          console.log('err: ', err);
          expect.fail('catch block was called');
          return
        });
    });
  });

  describe('getAllCategories()', () => {

    after(() => {
      testUtility.deleteAllDocuments('Post', keystone);
      testUtility.deleteAllDocuments('PostCategory', keystone);
    });

    it('should return an empty array if no categories exist', () => {
      return getAllCategories()
        .then(categories => {
          expect(categories).to.be.an('array');
          expect(categories).to.have.lengthOf(0);
          return
        })
        .catch(err => {
          console.log('err: ', err);
          expect.fail();
          return
        })
    })

    it('should list all of the categories in alphabetical order', () => {
      return Promise.all([
        testUtility.insertCategory('foo', keystone),
        testUtility.insertCategory('bar', keystone),
        testUtility.insertCategory('baz', keystone),
      ]).then(() => {
        return getAllCategories()
          .then(categories => {
            expect(categories).to.have.lengthOf(3);
            expect(_.map(categories,'name')).to.have.ordered.members(['bar', 'baz', 'foo'])
            return
          })
          .catch(err => {
            console.log('err: ', err);
            expect.fail();
            return
          });
      });
    });
  });
});
