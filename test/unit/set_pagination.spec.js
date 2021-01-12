const expect = require('chai').expect;
const httpMocks = require('node-mocks-http');
const setPagination = require('../../_lib/set/pagination')

describe('Set Pagination Middleware', () => {
  let req = httpMocks.createRequest();
  let skip = Math.floor(Math.random() * 10);
  let limit = Math.floor(Math.random() * 20);
  req.query = { skip: skip, limit: limit }
  setPagination(req);

  it('should accept one argument', () => { expect(setPagination.length).to.equal(1); });

  it('should add skip to `req.locals` object', () => {
    expect(!!req.locals).to.be.true;
    expect(req.locals.skip !== null).to.be.true;
    expect(req.locals.skip).to.be.eq(skip)
  });

  it('should add limit to `req.locals` object', () => {
    expect(!!req.locals).to.be.true;
    expect(req.locals.limit !== null).to.be.true;
    expect(req.locals.limit).to.be.eq(limit)
  });


})
