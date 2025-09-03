import { db } from '../db/db.js';
import bcrypt from 'bcrypt';

async function find(userId) {
  const usuario = await db('usuarios').where({ id: userId }).first();
  return usuario;
}

async function create(newUserData) {
  const hashedPassword = await bcrypt.hash(newUserData.senha, 10);

  const userToSave = {
    ...newUserData,
    senha: hashedPassword,
  };

  const [usuario] = await db('usuarios').returning('*').insert(userToSave);
  return usuario;
}

async function findUserByEmail(userEmail) {
  return await db('usuarios').where({ email: userEmail }).first();
}

async function remove(userId) {
  return await db('usuarios').where({ id: userId }).delete();
}

export const usuariosRepository = {
  find,
  create,
  findUserByEmail,
  remove,
};
