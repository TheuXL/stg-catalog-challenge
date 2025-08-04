// src/components/auth/ForgotPasswordForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { api } from '../../api';

const ForgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSuccess: () => void;
}

export const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      toast.success('Se o e-mail estiver correto, você receberá um link para redefinir sua senha.');
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
      <p className="text-center text-sm text-slate-600">
        Digite seu e-mail para receber um link de redefinição de senha.
      </p>
      <Input
        label="E-mail"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Enviar Link de Recuperação
      </Button>
    </form>
  );
};
