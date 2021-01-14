// not using assert and should, using only expect
const expect = require('chai').expect;
const request = require('supertest')('http://localhost:5000');
// Mock data
// const demosData = require('../data/_builder.mock')('demos');

let keys;

// describe('Create an account', () => {
// 	it('should create a new account', done => {
// 		request
// 			.post('/v1/auth/signup')
// 			.set('Accept', 'application/json')
// 			.send(usersData)
// 			.end((err, res) => {
// 				if (err) done(err);
// 				console.log(res.body)
// 				expect(res.statusCode).to.equal(201);
// 				done();
// 			})
// 	})
// })

// describe(`Authentication`, () => {
// 	it(`should sign in as ${usersData.users.fullName}`, done => {
// 		let creds = { email: usersData.users.email, password: usersData.users.password }
// 		request.post('/v1/auth/signin').set('Accept', 'application/json').send(creds).end((err, res) => {
// 			if (err) done(err);
// 			keys = res.body;
// 			expect(res.statusCode).to.equal(201);
// 			done();
// 		})
// 	})
// })

// describe('Create demos', () => {
// 	it('should create demo', done => {
// 		request.post('/v1/demos').set('Accept', 'application/json').send(demosData).end((err, res) => {
// 			let data = res.body.ops;
// 			if (err) done(err);
// 			if (!data) console.log(res.body, demosData)

// 			Array.isArray(data) && data.length === 1
// 				? expect(data.length).to.equal(1)
// 				: expect(data.length).to.equal(demosData.length);
// 			expect(res.statusCode).to.equal(200);
// 			return done();
// 		});
// 	});

// 	it('should protect route to get all demos', done => {
// 		request
// 			.get('/v1/demos')
// 			.set('Accept', 'application/json')
// 			.end((err, res) => {
// 				if (err) done(err);
// 				let { error } = res.body;
// 				expect(error).to.equal('No token provided');
// 				expect(res.statusCode).to.equal(403);
// 				done();
// 			});
// 	});
// });


// describe('List all demos', () => {
// 	it('should get all demos', done => {
// 		request.get('/v1/demos')
// 			.set('Accept', 'application/json')
// 			.set('Authorization', `Bearer ${keys.testSecretKey}`)
// 			.end((err, res) => {
// 				if (err) done(err);
// 				let data = res.body;
// 				expect(res.statusCode).to.equal(200);
// 				done();
// 			})
// 	})
// })