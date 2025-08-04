// src/api/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../config/supabaseClient';

// Estendendo o tipo Request para incluir a propriedade 'user'
export interface AuthenticatedRequest extends Request {
  user?: any; 
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  // Anexa o usuário à requisição para uso posterior nos controllers
  req.user = user;
  
  next();
};
