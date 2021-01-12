const expect = require('chai').expect;
const request = require('supertest')('http://localhost:5000/v1/');
const mocker = require('../data/_builder.mock');

let author = require('../data/auth.mock');
let creds = { keys: {}, email: '', password: '' };
let header = { accept: ['Accept', 'application/json'], auth: [] }
let amenities;


describe(`Sign in as ${author.users.fullName}`, () => {
  it('should get amenities', done => {
    request.get('amenities').set('Accept', 'application/json').end((err, res) => {
      amenities = res.body;
      done();
    });
  })
  it('should get user creds', done => {
    request.post('auth/signin').set('Accept', 'application/json').send(author.users).end((err, res) => {
      if (err) done(err);
      creds.keys = res.body;
      header.auth = ['Authorization', `Bearer ${res.body.testSecretKey}`]
      expect(res.statusCode).to.equal(201);
      done();
    })
  })
})

describe(`Spaces`, () => {
  let address_ids, building_id, apartment_id, room_id, addressCount = 2
  it('should add an address', done => {
    request.post('addresses').set(...header.accept).set(...header.auth).send(mocker('addresses', addressCount)).end((err, res) => {
      if (err) done(err);
      address_ids = res.body.map(e => e._id);
      expect(res.statusCode).to.equal(200);
      expect(address_ids.length).to.equal(addressCount);
      done();
    })
  })
  it('should add a building', done => {
    let building = mocker('buildings');
    building.address_ids = address_ids
    request.post('buildings').set(...header.accept).set(...header.auth).send(building).end((err, res) => {
      if (err) done(err);
      building_id = res.body[0]._id;
      expect(res.statusCode).to.equal(200);
      expect(!!res.body[0].account_id).to.equal(true);
      done();
    })
  })
  it('should add an apartment', done => {
    let apartment = mocker('apartments');
    apartment.building_id = building_id;
    request.post('apartments').set(...header.accept).set(...header.auth).send(apartment).end((err, res) => {
      if (err) done(err);
      apartment_id = res.body[0]._id;
      expect(res.statusCode).to.equal(200);
      expect(!!res.body[0].account_id).to.equal(true);
      expect(res.body[0].building_id).to.equal(building_id);
      done();
    })
  })
  it('should add a room', done => {
    let room = mocker('rooms');
    room.apartment_id = apartment_id;
    request.post('rooms').set(...header.accept).set(...header.auth).send(room).end((err, res) => {
      if (err) done(err);
      room_id = res.body[0]._id;
      expect(res.statusCode).to.equal(200);
      expect(!!res.body[0].account_id).to.equal(true);
      expect(res.body[0].apartment_id).to.equal(apartment_id);
      done();
    })
  })
  it('should retrieve the building', done => {
    request.get(`buildings/${building_id}`).set(...header.accept).set(...header.auth).send({ expand: true }).end((err, res) => {
      if (err) done(err);
      expect(res.statusCode).to.equal(200);
      expect(!!res.body[0].account_id).to.equal(true);
      expect(res.body[0].addresses.length).to.equal(addressCount);
      done();
    })
  })
  it('should retrieve the room', done => {
    request.get(`rooms/${room_id}`).set(...header.accept).set(...header.auth).send({ expand: true }).end((err, res) => {
      if (err) done(err);
      expect(res.statusCode).to.equal(200);
      expect(!!res.body[0].account_id).to.equal(true);
      expect(res.body[0].apartment_id).to.equal(apartment_id);
      expect(res.body[0].apartments.length).to.equal(1);
      done();
    })
  })
})

