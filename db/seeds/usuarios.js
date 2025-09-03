import bcrypt from 'bcrypt';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('usuarios').del();

  const saltRounds = 10;

  await knex('usuarios').insert([
    {
      nome: 'Cesar',
      email: 'cesar@example.com',
      senha: await bcrypt.hash('123456', saltRounds),
    },
    {
      nome: 'Arthur',
      email: 'arthur@example.com',
      senha: await bcrypt.hash('senha123', saltRounds),
    },
    {
      nome: 'Gabriel',
      email: 'gabriel@example.com',
      senha: await bcrypt.hash('meusegredo', saltRounds),
    },
  ]);
}
