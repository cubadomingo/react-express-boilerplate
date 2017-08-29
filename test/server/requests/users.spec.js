import chai from 'chai';
import { expect } from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import server from '../../src/server';
import knex from '../../src/models/knex';

chai.use(chaiHttp);

describe('Users', function() {
  // create a jwt token for accessing protected routes
  const token = jwt.sign({username: 'cubadomingo'}, process.env.SECRET);

  // rollback migrations and set latest migrations
  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        knex.seed.run()
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

  describe('GET /api/v1/users', function() {
    it('retrieves a list of all users', function() {
      return chai.request(server)
      .get('/api/v1/users')
      .set('x-access-token', token)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.length).to.equal(1);
      });
    });
  });

  describe('PUT /api/v1/users', function() {
    it('edits a user\'s information', function() {
      const params = {
        username: 'cubadomingo650',
        email: 'new@devinosor.io',
        password: 'newpassword',
        password_confirmation: 'newpassword',
      };

      return chai.request(server)
      .put('/api/v1/users/1')
      .set('x-access-token', token)
      .send(params)
      .then((res) => {
        const { username, email } = res.body.data[0];

        expect(res).to.have.status(200);
        expect(username).to.equal(params.username);
        expect(email).to.equal(params.email);
      });
    });

    it('edits a user\'s username only', function() {
      const params = {
        username: 'cubadomingo650',
      };

      return chai.request(server)
      .put('/api/v1/users/1')
      .set('x-access-token', token)
      .send(params)
      .then((res) => {
        const { username } = res.body.data[0];

        expect(res).to.have.status(200);
        expect(username).to.equal(params.username);
      });
    });

    it('edits a user\'s email only', function() {
      const params = {
        email: 'new@devinosor.io',
      };

      return chai.request(server)
      .put('/api/v1/users/1')
      .set('x-access-token', token)
      .send(params)
      .then((res) => {
        const { email } = res.body.data[0];

        expect(res).to.have.status(200);
        expect(email).to.equal(params.email);
      });
    });

    it('edits a user\'s password only', function() {
      const params = {
        password: 'newpassword',
        password_confirmation: 'newpassword',
      };

      return chai.request(server)
      .put('/api/v1/users/1')
      .set('x-access-token', token)
      .send(params)
      .then((res) => {
        const { username, email } = res.body.data[0];

        expect(res).to.have.status(200);
        expect(username).to.exist;
        expect(email).to.exist;
      });
    });

    it('errors if no password_confirmation', function () {
      const params = {
        password: 'newpassword',
      };

      return chai.request(server)
      .put('/api/v1/users/1')
      .set('x-access-token', token)
      .send(params)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal(
          'password_confirmation is required when changing password'
        );
      });
    });

    it('errors if password_confirmation and password do not match', function() {
      const params = {
        username: 'sample',
        email: 'fake@email.com',
        password: 'password',
        password_confirmation: 'password11',
      };

      return chai.request(server)
      .put('/api/v1/users/1')
      .set('x-access-token', token)
      .send(params)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal(
          'password and password_confirmation do not match'
        );
      });
    });

    it('errors if the user is not found', function() {
      const params = {
        username: 'cubadomingo',
        email: 'me@devinosor.io',
        password: 'password',
        password_confirmation: 'password',
      };

      return chai.request(server)
      .put('/api/v1/users/1000')
      .set('x-access-token', token)
      .send(params)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal(
          'user not found'
        );
      });
    });
  });

  describe('DELETE /api/v1/users/:id', function() {
    it('destroys a user', function() {
      return chai.request(server)
      .delete('/api/v1/users/1')
      .set('x-access-token', token)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('user has been deleted');
      });
    });

    it('errors if user could not be found', function() {
      return chai.request(server)
      .delete('/api/v1/users/100')
      .set('x-access-token', token)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('user was not found');
      });
    });
  });

  describe('POST /api/v1/users', function() {
    it('creates a new user', function() {
      const params = {
        username: 'cubadomingo',
        email: 'me@devinosor.io',
        password: 'password',
        password_confirmation: 'password',
      };

      return chai.request(server)
      .post('/api/v1/users')
      .set('x-access-token', token)
      .send(params)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data[0].username).to.equal(params.username);
        expect(res.body.data[0].email).to.equal(params.email);
      });
    });

    it('errors if required params are missing', function() {
      const params = {
      };

      return chai.request(server)
      .post('/api/v1/users')
      .set('x-access-token', token)
      .send(params)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal(
          'username is required, password is required, password_confirmation is required, email is required'
        );
      });
    });

    it('errors if password_confirmation is wrong', function() {
      const params = {
        username: 'cubadomingo',
        email: 'me@devinosor.io',
        password: 'password',
        password_confirmation: 'password11',
      };

      return chai.request(server)
      .post('/api/v1/users')
      .set('x-access-token', token)
      .send(params)
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal(
          'password and password_confirmation do not match'
        );
      });
    });
  });
});
