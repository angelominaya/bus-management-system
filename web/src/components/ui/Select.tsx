import { Form } from 'react-bootstrap';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  size?: 'sm' | 'lg';
}

export function Select({
  label,
  error,
  options = [],
  placeholder = 'Seleccionar...',
  className = '',
  id,
  size,
  ...props
}: SelectProps) {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Form.Group className="mb-3">
      {label && <Form.Label htmlFor={selectId}>{label}</Form.Label>}
      <Form.Select id={selectId} isInvalid={!!error} className={className} size={size} {...props}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </Form.Select>
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
}
