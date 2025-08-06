// src/server.ts
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { apiRoutes } from './api/routes';

const app = express();

app.use(cors()); // Permite requisições de diferentes origens (seu frontend)
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

app.use('/api', apiRoutes); // Centraliza todas as rotas da API sob /api

export default app;
