// src/server.ts
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { apiRoutes } from './api/routes';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors()); // Permite requisições de diferentes origens (seu frontend)
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

app.use('/api', apiRoutes); // Centraliza todas as rotas da API sob /api

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  }
});

export { app, server };
