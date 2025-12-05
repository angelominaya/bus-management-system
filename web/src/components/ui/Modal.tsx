import { Modal as BsModal } from 'react-bootstrap';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size }: ModalProps) {
  return (
    <BsModal show={isOpen} onHide={onClose} size={size} centered>
      <BsModal.Header closeButton className="bg-light">
        <BsModal.Title as="h5">{title}</BsModal.Title>
      </BsModal.Header>
      <BsModal.Body>{children}</BsModal.Body>
    </BsModal>
  );
}
