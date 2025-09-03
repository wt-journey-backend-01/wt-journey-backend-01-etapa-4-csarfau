import express from 'express';
import { agentesRouter } from './routes/agentesRoutes.js';
import { casosRouter } from './routes/casosRoutes.js';
import { errorHandler } from './utils/errorHandler.js';
import dayjs from 'dayjs';
import { authRouter } from './routes/authRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

function formatDates(obj) {
  if (obj instanceof Date) {
    return dayjs(obj).format('YYYY-MM-DD');
  }
  if (Array.isArray(obj)) {
    return obj.map(formatDates);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, formatDates(v)]));
  }
  return obj;
}

app.use(function (req, res, next) {
  const oldJson = res.json;
  res.json = function (data) {
    return oldJson.call(this, formatDates(data));
  };
  next();
});

app.use(express.json());

app.use('/agentes', authMiddleware, agentesRouter);
app.use('/casos', authMiddleware, casosRouter);
app.use('/auth', authRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor do Departamento de Polícia rodando em: http://localhost:${PORT}`);
});
