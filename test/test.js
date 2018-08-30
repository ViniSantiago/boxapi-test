var supertest = require('supertest');  
var chai = require('chai');  
var app = require('../api.js');

global.app = app;  
global.expect = chai.expect;  
global.request = supertest(app);  



const URL_API = '/api/';
const VERSION = 'v0/';

const PATH_USER = 'user/' // Get
const PATH_SIGNUP = 'signup/'; //Put
const PATH_ME = 'getme/'; //Post
const PATH_LIST_ALL = 'listall/'; //get
const PATH_DELETE_BYID = 'deletebyid/'; //Post
const PATH_METRICS = '/metrics'; //get


describe('app', () => {

    after(function() {
    app.close();
    });

   describe('GET /', function() {
       it('returns welcome msg', function(done) {
           request.get('/')
                .expect(200)
                .end(done)
                });
    
  });
    
  describe('GET /api/v0', function() {
    it('returns welcome msg', function(done) {
        request.get(URL_API + VERSION)
             .expect(200)
             .end(done)
             });
 
});

  describe('GET / listall', function() {
       it('returns welcome msg', function(done) {
            request.get(URL_API + VERSION + PATH_USER + PATH_LIST_ALL)
                .expect(200)
                .end(done)
                });
   
    });

     describe('POST /get_me', function() {
         it('returns an user', function(done)
             {
             request.post(URL_API + VERSION + PATH_USER + PATH_ME, )
             .send('')
             .set ('Accept','application/json')
             .expect(200)             
             .end(done) 
             });
         });
     
         describe('DELETE /delete_byID', function() {
            it('returns an user', function(done)
                {
                request.del (URL_API + VERSION + PATH_USER + PATH_DELETE_BYID)
                .send('{"_id":"5b7ef24fb968584a9add673c"}')
                .set ('Accept','application/json')
                .expect(200)             
                .end(done) 
                });
            });


     describe('PUT /signup', function() {
        
        it('register an user', function(done)
            {
            request.put (URL_API + VERSION + PATH_USER + PATH_SIGNUP)
            .send ('{"email":"teste@teste.com","nome":"nomedoteste"}')
            .set ('Accept','application/json')
            .expect(200)             
            .end(done) 
            });
        });
    
        describe('GET /metrics', function() {
        
            it('get prometheus metrics', function(done)
                {
                request.get(PATH_METRICS)
                .expect(200)             
                .end(done) 
                });
            });
        })
