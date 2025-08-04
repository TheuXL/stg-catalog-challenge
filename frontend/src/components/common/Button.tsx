// src/components/common/Button.tsx
import { ComponentProps, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, ClassValue } from 'clsx';
import { Spinner } from './Spinner';
import { Slot } from '@radix-ui/react-slot';

const buttonVariants = {
  variant: {
    default: 'bg-slate-900 text-white hover:bg-slate-700',
    outline: 'border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-900',
    danger: 'bg-red-500 text-white hover:bg-red-700',
  },
};

interface ButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean;
  asChild?: boolean;
  variant?: keyof typeof buttonVariants.variant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, asChild = false, variant = 'default', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={twMerge(
          'flex items-center justify-center rounded-md px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          buttonVariants.variant[variant],
          clsx(className as ClassValue)
        )}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? <Spinner /> : children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button };
