const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const setQuery = require('../../_lib/set/query')

describe('Set Query Middleware', () => {

  it('should accept one argument', () => { expect(setQuery.length).to.equal(1); });

  it('should add a query to `req.locals` object', () => {
    let req = httpMocks.createRequest();
    req.schemas = require('../../_lib/schemas');
    req.params.string = "A random String";
    req.baseUrl = '/api/demos';
    setQuery(req);
    expect(!!req.locals).to.be.true
    expect(!!req.locals.query).to.be.true
  });


})
