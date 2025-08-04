// src/api/services/auth.service.ts
import { supabase } from '../../config/supabaseClient';

export const sendPasswordResetEmail = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/update-password', // URL para onde o usuário será redirecionado
  });

  if (error) {
    // Não revelamos se o e-mail existe ou não por segurança.
    // Lançamos um erro genérico para o controlador tratar.
    console.error('Erro ao tentar enviar e-mail de recuperação:', error.message);
    throw new Error('Não foi possível processar a solicitação de recuperação de senha.');
  }
};
