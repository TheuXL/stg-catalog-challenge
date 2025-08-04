// src/components/auth/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof LoginSchema>;

interface LoginFormProps {
  onForgotPasswordClick: () => void;
}

export const LoginForm = ({ onForgotPasswordClick }: LoginFormProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Login bem-sucedido!');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
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
      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPasswordClick}
          className="text-sm text-blue-600 hover:underline"
        >
          Esqueceu a senha?
        </button>
      </div>
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Entrar
      </Button>
    </form>
  );
};
