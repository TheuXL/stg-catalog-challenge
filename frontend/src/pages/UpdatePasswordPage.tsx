// src/pages/UpdatePasswordPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const UpdatePasswordSchema = z.object({
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type UpdatePasswordFormData = z.infer<typeof UpdatePasswordSchema>;

export const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(UpdatePasswordSchema),
  });

  // Supabase lê o token do fragmento da URL (#) automaticamente
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Você já está em uma sessão de recuperação de senha.
      }
    });
  }, []);

  const handleUpdatePassword = async (data: UpdatePasswordFormData) => {
    const { error } = await supabase.auth.updateUser({ password: data.password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Senha atualizada com sucesso! Você pode fazer login agora.');
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-bold">Crie uma Nova Senha</h2>
        <form onSubmit={handleSubmit(handleUpdatePassword)} className="space-y-4">
          <Input
            label="Nova Senha"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Atualizar Senha
          </Button>
        </form>
      </div>
    </div>
  );
};
