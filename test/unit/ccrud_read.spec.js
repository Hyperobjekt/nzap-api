process.env.MONGO_URL = 'mongodb+srv://apiary:DiXGLmc99xfWszEb@kaperu-dev.xwpib.mongodb.net/kaperu?authSource=admin&replicaSet=atlas-10vn5x-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=false&ssl=true';
const expect = require('chai').expect;
const { MongoClient } = require('mongodb');
const httpMocks = require('node-mocks-http');
const ccrudRead = require('../../_lib/ccrud/read');
const db = require('../../_lib/ccrud/_config')


describe('CCRUD Read Middleware', () => {

  it('should accept three argument', () => { expect(ccrudRead.length).to.equal(3); });


});








