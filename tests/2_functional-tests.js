/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
      test('#example Test GET /api/books',  function(done) {
           chai
          .request(server)
          .keepOpen() 
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });
      /*
      * ----[END of EXAMPLE TEST]----
      */

      suite('Routing tests', function() {


        suite('POST /api/books with title => create book object/expect book object', function() {
          
          test('Test POST /api/books with title', function(done) {
          chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({
            "title": "Education"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, 'title', 'response object should contain title property');
            assert.property(res.body, '_id', 'response object should contain _id property');
            done();
          });
          });
          
          test('Test POST /api/books with no title given',  function(done) {
            chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({
            "title": ""
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isString(res.text, 'response should be a string');
            done();
          });
          });
        });


        suite('GET /api/books => array of books', function(){
          
          test('Test GET /api/books',  function(done){
            chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            done();
          });
          });      
          
        });


        suite('GET /api/books/[id] => book object with [id]', function(){
          
          test('Test GET /api/books/[id] with id not in db',  function(done){
            chai
            .request(server)
            .keepOpen()
            .get('/api/books/6750a8b99f597337463a251b')
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.isString(res.text, 'response should be a string');
              done();
            });
          });
          
          test('Test GET /api/books/[id] with valid id in db',  function(done){
            chai
            .request(server)
            .keepOpen()
            .get('/api/books/6750a8d99f597337463a251f')
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'response should be an object');
              assert.property(res.body, '_id', 'response object should contain _id property');
              assert.property(res.body, 'comments', 'response object should contain comments property');
              assert.property(res.body, 'title', 'response object should contain title property');
              assert.property(res.body, 'commentcount', 'response object should contain commentcount property');
              done();
            });
          });
          
        });


        suite('POST /api/books/[id] => add comment/expect book object with id', function(){
          
          test('Test POST /api/books/[id] with comment', function(done){
            chai
              .request(server)
              .keepOpen()
              .post('/api/books/6750a8d99f597337463a251f')
              .send({
                "comment": "great"
              })
              .end(function(err, res){
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be a object');
                assert.property(res.body, '_id', 'response object should contain _id property');
                assert.property(res.body, 'comments', 'response object should contain comments property');
                assert.property(res.body, 'title', 'response object should contain title property');
                assert.property(res.body, 'commentcount', 'response object should contain commentcount property');
                done();
              });
          });

          test('Test POST /api/books/[id] without comment field', function(done){
            chai
              .request(server)
              .keepOpen()
              .post('/api/books/6750a8d99f597337463a251f')
              .send({
                "comment": ""
              })
              .end(function(err, res){
                assert.equal(res.status, 200);
                assert.isString(res.text, 'response should be a string');
                assert.equal(res.text, 'missing required field comment');
                done();
              });
          });

          test('Test POST /api/books/[id] with comment, id not in db', function(done){
            chai
            .request(server)
            .keepOpen()
            .post('/api/books/674f48af05bdc287o2123048')
            .send({
              "comment": "good"
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.isString(res.text, 'response should be a string');
              assert.equal(res.text,'no book exists');
              done();
            });
          });
          
        });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
        .request(server)
        .keepOpen()
        .delete('/api/books/6750a8c99f597337463a251d')
        .send({
          "_id": "6750a8c99f597337463a251d"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be a string');
          assert.equal(res.text,'delete successful');
          done();
        });
            });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .keepOpen()
        .delete('/api/books/674f48af05bmc24732833048')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.text, 'response should be a string');
          assert.equal(res.text,'no book exists');
          done();
        });
      });

    });

  });

});
