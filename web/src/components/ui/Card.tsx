import { Card as BsCard } from 'react-bootstrap';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <BsCard className={`shadow-sm border-0 ${className}`}>{children}</BsCard>;
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <BsCard.Header className={`bg-white border-bottom ${className}`}>{children}</BsCard.Header>;
}

export function CardBody({ children, className = '' }: CardProps) {
  return <BsCard.Body className={className}>{children}</BsCard.Body>;
}
