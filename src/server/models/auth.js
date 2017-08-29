import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import knex from './knex';

export const authenticate = (body) => {
  return knex('users')
  .where('username', body.username)
  .then((user) => {
    if (user.length > 0) {
      return bcrypt.compare(body.password, user[0].password);
    } else {
      return false;
    }
  })
  .then((response) => {
    if (response) {
      const payload = { username: body.username };
      const expires = { expiresIn: '24h' };

      return jwt.sign(payload, process.env.SECRET, expires);
    } else {
      throw new Error('username or password is not valid');
    }
  });
};
