import { Button as BsButton } from 'react-bootstrap';
import type { ButtonProps as BsButtonProps } from 'react-bootstrap';
import type { ReactNode } from 'react';

interface ButtonProps extends Omit<BsButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline-primary' | 'outline-secondary' | 'outline-danger' | 'link';
  size?: 'sm' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <BsButton
      variant={variant}
      size={size}
      className={`d-inline-flex align-items-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </BsButton>
  );
}
