var supertest = require('supertest');  
var chai = require('chai');  
var app = require('../api.js');
var mongoose = require("mongoose");
var User = mongoose.model('User');
var assert = require('assert');
var should = chai.should();

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

var testUser = new User({
    name: 'Mike',
    email: 'email@gmail.com',
    userid: '123456' });

describe('app', () => {

    after(function() {
    mongoose.connection.db.dropDatabase();
    app.close();
    });

    before((done) => { // runs before all tests
   
    testUser.save(done);
               
    });
    describe('GET /', function() {
       it('retorna mensagem inicial', function(done) {
           request.get('/')
            .expect(200)
            .expect('{"box":"Projeto Box - Versão Inicial"}')
            .end((err) => {
                if (err) return done(err);
                 done();
            }); 
        });
    
    });
    
    describe('GET /api/v0', function() {
        it('returns welcome msg', function(done) {
            request.get(URL_API + VERSION)
            .expect(200)
            .expect('{"box":"Projeto Box - Versão Inicial"}')
            .end((err) => {
                if (err) return done(err);
                done();
            }); 
        });
 
    });

    describe.only('GET / listall', function() {
        it('returns users list', function(done) {
            request.get(URL_API + VERSION + PATH_USER + PATH_LIST_ALL)
            .expect(200)
            .expect(function(res) {
          
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('email');
            res.body.should.have.property('userid');
            res.body.should.have.property('products');
            res.body.should.have.property('_id');
            })
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

        it('returns error for invalid user', function(done)
        {
            request.post(URL_API + VERSION + PATH_USER + PATH_ME, )
            .send('{"email":"xikinix@gmail.com"}')
            .set ('Accept','application/json')
            .expect('Content-Type', /json/)
            .expect({
              succ:{
                 data: null }
            })
            .expect(200)             
            .end((err) => {
            if (err) return done(err);
            done();
        }); 
    });
});

    
     
    describe('DELETE /delete_byID', function() {
        it('delete an user', function(done) {
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
        
        it('register exist email user for error', function(done)
            {
            request.put (URL_API + VERSION + PATH_USER + PATH_SIGNUP)
            .send ('{"email":"teste@teste.com","nome":"mesmoemail"}')
            .set ('Accept','application/json')
            .expect(200)             
            .end(done) 
        });
        
        it('register a second user', function(done)
            {
            request.put (URL_API + VERSION + PATH_USER + PATH_SIGNUP)
            .send ('{"email":"segundouser@teste.com","nome":"nomedoteste"}')
            .set ('Accept','application/json')
            .expect(200)             
            .end(done) 
        });

        it('register a invalid user', function(done)
        {
        request.put (URL_API + VERSION + PATH_USER + PATH_SIGNUP)
        .send ('{"email":"","nome":"nomedoteste"}')
        .set ('Accept','application/json')
        .expect(400)             
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
