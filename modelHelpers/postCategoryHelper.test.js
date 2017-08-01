const keystone = require('keystone');
const pch = require('./postCategoryHelper');
const expect = require('chai').expect;
const _ = require('lodash');
const appTest = require('../app.test.js');

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
  it('should return an empty array if no categories exist', () => {
    return pch.getAllCategories()
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
      insertCategory('foo', keystone),
      insertCategory('bar', keystone),
      insertCategory('baz', keystone),
    ]).then(() => {
      return pch.getAllCategories()
        .then(categories => {
          expect(categories).to.have.lengthOf(3);
          expect(_.map(categories,'name')).to.have.ordered.members(['bar', 'baz', 'foo'])
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
