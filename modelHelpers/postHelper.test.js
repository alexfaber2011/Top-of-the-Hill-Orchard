const keystone = require('keystone');
const expect = require('chai').expect;
const _ = require('lodash');
const testUtility = require('../app.test.js');
const postHelper = require('./postHelper');

const EXAMPLE_POST = {
  "_id": "59372fc83f804c7a8ed864ba",
  "slug": "janet-s-favorite-way-to-bake-a-pie",
  "title": "Janet's Favorite Way to Bake a Pie",
  "__v": 6,
  "author": {
    "_id": "59372c693f804c7a8ed864b8",
    "password": "$2a$10$v0mR.2l/82oyfJ3GLVKN3uqeNtlRSSlhZkXw.HBwW.SbToC6VRgqu",
    "email": "sjfaber6@gmail.com",
    "__v": 0,
    "isAdmin": true,
    "name": {
      "last": "User",
      "first": "Admin"
    }
  },
  "publishedDate": new Date("2017-06-06T07:00:00.000Z"),
  "categories": [],
  "content": {
    "brief": "<p>Hello, how are we doing here?</p>",
    "extended": "<h2>Hello world</h2>\r\n<p>This is a little bit longer. &nbsp;We've got all kinds of goodies here.</p>"
  },
  "image": {
    "public_id": "kep80fbm5dubbpfa2lyy",
    "version": 1496789023,
    "signature": "d87f48a7f29f4f2c3162a6a6ebd114a621af1de3",
    "width": 728,
    "height": 485,
    "format": "jpg",
    "resource_type": "image",
    "url": "http://res.cloudinary.com/keystone-demo/image/upload/v1496789023/kep80fbm5dubbpfa2lyy.jpg",
    "secure_url": "https://res.cloudinary.com/keystone-demo/image/upload/v1496789023/kep80fbm5dubbpfa2lyy.jpg"
  },
  "state": "published"
};

const EXAMPLE_PAGINATED_POSTS_RESPONSE = {
  "total": 1,
  "results": [
    EXAMPLE_POST,
    _.merge(_.cloneDeep(EXAMPLE_POST), {'publishedDate': new Date("2017-07-06T07:00:00.000Z"), 'foo': 'bar'})
  ],
  "currentPage": 1,
  "totalPages": 1,
  "pages": [
    1
  ],
  "previous": false,
  "next": false,
  "first": 1,
  "last": 1
}

describe('Post Helper', () => {

  describe('[non-db functions]', () => {

    describe('enrichPaginationReponse()', () => {

      it('should add a humandReadablePublishedDate to every post', () => {
        const actualResult = postHelper.enrichPaginationReponse(EXAMPLE_PAGINATED_POSTS_RESPONSE);
        expect(actualResult.results[0].humanReadablePublishedDate).to.equal('June 6th 2017');
        expect(actualResult.results[1].humanReadablePublishedDate).to.equal('July 6th 2017');
      });

      it('shouldn\'t puke when a publishedDate is falsy', () => {
        const examplePaginatedPostResponse = _.merge(_.cloneDeep(EXAMPLE_PAGINATED_POSTS_RESPONSE), {results: [_.set(_.cloneDeep(EXAMPLE_POST), 'publishedDate', null)]});
        const actualResult = postHelper.enrichPaginationReponse(examplePaginatedPostResponse);
        expect(actualResult.results[0].humanReadablePublishedDate).to.equal('Invalid date');
      });
    });
  });

  describe('[db functions]', () => {

    afterEach(() => {
      testUtility.deleteAllDocuments('Post', keystone);
      testUtility.deleteAllDocuments('PostCategory', keystone);
    });

    describe('getPage()', () => {
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
                expect(paginationResponse.total).to.equal(25);
                expect(paginationResponse.results).to.have.lengthOf(7);
              });
          });
      });
    });
  });
});
