import { Form } from 'react-bootstrap';
import type { FormControlProps } from 'react-bootstrap';

interface InputProps extends Omit<FormControlProps, 'size'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'lg';
}

export function Input({ label, error, className = '', id, size, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label htmlFor={inputId}>{label}</Form.Label>}
      <Form.Control
        id={inputId}
        isInvalid={!!error}
        className={className}
        size={size}
        {...props}
      />
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
