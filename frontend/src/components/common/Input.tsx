// src/components/common/Input.tsx
import { forwardRef, ComponentProps } from 'react';

interface InputProps extends ComponentProps<'input'> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, error, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        <label htmlFor={name} className="font-medium text-slate-700">
          {label}
        </label>
        <input
          id={name}
          name={name}
          ref={ref}
          className="rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);
