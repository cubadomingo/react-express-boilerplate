import chai from 'chai';
import { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../src/server';
import knex from '../../src/models/knex';

chai.use(chaiHttp);

describe('Authentication', function() {
  // set migrations and seeds
  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        return knex.seed.run()
        .then(() => {
          done();
        });
      });
    });
  });

  // clear database
  afterEach(function(done) {
    knex.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('Request Token', function() {
    it('returns a token with proper credentials', function() {
      const params = {
        username: 'fake_user',
        password: 'password'
      };

      return chai.request(server)
      .post('/api/v1/authenticate')
      .send(params)
      .then((res) => {
        expect(res).to.have.status(200);
        expect('token' in res.body).to.equal(true);
      });
    });

    it('returns an error if password is wrong', function() {
      const params = {
        username: 'cubadomingo',
        password: 'password510'
      };

      return chai.request(server)
      .post('/api/v1/authenticate')
      .send(params)
      .then((res) => {
        expect(res).to.have.status(404);
        expect('token' in res.body).to.equal(false);
        expect(res.body.message).to.equal('username or password is not valid');
      });
    });

    it('returns an error if username is wrong', function() {
      const params = {
        username: 'cubadomingo5000',
        password: 'password'
      };

      return chai.request(server)
      .post('/api/v1/authenticate')
      .send(params)
      .then((res) => {
        expect(res).to.have.status(404);
        expect('token' in res.body).to.equal(false);
        expect(res.body.message).to.equal('username or password is not valid');
      });
    });
  });

  describe('Authenticate Token', function() {
    it('returns an error if token can not be authenticated', function() {
      const token = 'fakeToken';
      return chai.request(server)
      .delete('/api/v1/users/1')
      .set('x-access-token', token)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('failed to authenticate token');
      });
    });

    it('returns an error if no token is provided', function() {
      return chai.request(server)
      .delete('/api/v1/users/1')
      .set('x-access-token', '')
      .then((res) => {
        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('no token provided');
      });
    });
  });
});
