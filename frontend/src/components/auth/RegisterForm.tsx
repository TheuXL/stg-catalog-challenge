// src/components/auth/RegisterForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

const RegisterSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const handleRegister = async (data: RegisterFormData) => {
    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Registro bem-sucedido! Verifique seu e-mail para confirmação.');
      // O ideal é mostrar uma mensagem para o usuário checar o e-mail
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
      <Input
        label="E-mail"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Senha"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Input
        label="Confirmar Senha"
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Registrar
      </Button>
    </form>
  );
};
