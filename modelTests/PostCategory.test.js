const keystone = require('keystone');
const expect = require('chai').expect;
const _ = require('lodash');
const testUtility = require('../app.test.js');

describe('Post Category Model', () => {
  it('should delete all all instances of a PostCategory in all Posts', () => {
    testUtility.insertCategory('foobar', keystone)
      .then(() => {
        // expect.fail();
      })
  })
})
