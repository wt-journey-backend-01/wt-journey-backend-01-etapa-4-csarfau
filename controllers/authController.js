import * as z from 'zod';
import { usuariosRepository } from '../repositories/usuariosRepository.js';
import { createError } from '../utils/errorHandler.js';
import { formatZodErrors } from '../utils/formatZodErrors.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_super_secreta';
const JWT_EXPIRES = '1h';

const newUserSchema = z.object({
  nome: z.string("O campo 'nome' deve ser uma string.").min(1, "O campo 'nome' é obrigatório."),
  email: z.email("O campo 'email' deve ser um email válido").nonempty("O campo 'email' é obrigatório."),
  senha: z
    .string("O campo 'senha' deve ser uma string.")
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial.'),
});

const loginSchema = z.object({
  email: z.email("O campo 'email' deve ser um email válido").nonempty("O campo 'email' é obrigatório."),
  senha: z
    .string("O campo 'senha' deve ser uma string.")
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula.')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial.'),
});

async function register(req, res, next) {
  try {
    const newUserData = newUserSchema.parse(req.body);

    const user = await usuariosRepository.findUserByEmail(newUserData.email);

    if (user) {
      return next(createError(400, 'Este e-mail já está sendo utilizado.'));
    }

    const newUser = await usuariosRepository.create(newUserData);

    return res.status(201).json(newUser);
  } catch (err) {
    if (err.name === 'ZodError') {
      return next(createError(400, formatZodErrors(err)));
    }
    return next(err);
  }
}

async function login(req, res, next) {
  console.log('aqui no login');

  try {
    const { email, senha } = loginSchema.parse(req.body);
    const usuario = await usuariosRepository.findUserByEmail(email);
    if (!usuario) {
      return next(createError(401, 'Credenciais inválidas.'));
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.senha);

    if (!senhaConfere) {
      return next(createError(401, 'Credenciais inválidas.'));
    }

    const payload = { id: usuario.id, email: usuario.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return res.status(200).json({ access_token: token });
  } catch (err) {
    if (err.name === 'ZodError') {
      return next(createError(400, formatZodErrors(err)));
    }
    return next(err);
  }
}

async function logout(req, res) {
  //
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    const usuario = await usuariosRepository.find(userId);

    if (!usuario) {
      return next(createError(400, 'Usuário não encontrado.'));
    }

    await usuariosRepository.remove(usuario.id);

    return res.status(204).send();
  } catch (err) {
    if (err.name === 'ZodError') {
      return next(createError(400, formatZodErrors(err)));
    }
    return next(err);
  }
}

export const authController = {
  register,
  login,
  logout,
  deleteUser,
};
