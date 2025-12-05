import { Badge as BsBadge } from 'react-bootstrap';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'primary' | 'secondary';
}

export function Badge({ children, variant = 'gray' }: BadgeProps) {
  const variantMap: Record<string, string> = {
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    info: 'info',
    gray: 'secondary',
    primary: 'primary',
    secondary: 'secondary',
  };

  return (
    <BsBadge bg={variantMap[variant]} className="fw-medium">
      {children}
    </BsBadge>
  );
}
