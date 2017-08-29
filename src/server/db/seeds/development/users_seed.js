import { create } from '../../../models/users.js';

exports.seed = (knex) => {
  return knex('users').del()
  .then(function () {
    return create({
      username: 'fake_user',
      email: 'email@google.com',
      password: 'password',
      password_confirmation: 'password',
    });
  });
};
