// src/api/controllers/auth.controller.ts
import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'O campo de e-mail é obrigatório.' });
  }

  try {
    await authService.sendPasswordResetEmail(email);
    // Por segurança, sempre retornamos sucesso para não indicar se um e-mail está cadastrado ou não.
    return res.status(200).json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.' });
  } catch (error: any) {
    // O serviço já logou o erro real. Retornamos uma mensagem genérica.
    return res.status(500).json({ error: 'Ocorreu um erro interno ao processar a solicitação.' });
  }
};
