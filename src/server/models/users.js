import knex from './knex';
import bcrypt from 'bcrypt';

const Users = () => {
  return knex('users');
};

export const getAll = () => {
  return Users().select('id', 'username', 'email', 'created_at', 'updated_at');
};

export const edit = (id, body) => {
  if (!body.password === undefined) {
    return bcrypt.hash(body.password, 10)
    .then((hash) => {
      Users()
      .where('id', parseInt(id))
      .update({
        username: body.username,
        email: body.email,
        password: hash,
        updated_at: new Date(),
      }, [
        'id',
        'username',
        'email',
        'created_at',
        'updated_at'
      ])
      .then((user) => {
        if (user.length === 0) {
          throw new Error('user not found');
        }
        return user;
      });
    });
  } else {
    return Users()
    .where('id', parseInt(id))
    .update({
      username: body.username,
      email: body.email,
      password: body.password,
      updated_at: new Date(),
    }, [
      'id',
      'username',
      'email',
      'created_at',
      'updated_at'
    ])
    .then((user) => {
      if (user.length === 0) {
        throw new Error('user not found');
      }
      return user;
    });
  }
};

export const destroy = (id) => {
  return Users()
  .where('id', parseInt(id))
  .del();
};

export const create = (body) => {
  return bcrypt.hash(body.password, 10)
  .then((hash) => {
    return Users().insert({
      username: body.username,
      email: body.email,
      password: hash,
    }, [
      'id',
      'username',
      'email',
      'created_at',
      'updated_at'
    ]);
  });
};
