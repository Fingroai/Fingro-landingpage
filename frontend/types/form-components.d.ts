// Tipos para los componentes de formulario
import { ReactNode, ChangeEvent } from 'react';
import { UseFormRegister, FieldErrors, Control, Controller } from 'react-hook-form';
import { FormData } from './form-types';

// Interfaz para los componentes de campo
export interface FieldProps {
  name: string;
  label: string;
  required?: boolean;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  className?: string;
}

// Interfaz para campos de entrada
export interface InputFieldProps extends FieldProps {
  type?: 'text' | 'email' | 'number' | 'tel' | 'date' | 'password';
  placeholder?: string;
  value?: any;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}

// Interfaz para campos de selección
export interface SelectFieldProps extends FieldProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

// Interfaz para campos de radio
export interface RadioFieldProps extends FieldProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Interfaz para campos de checkbox
export interface CheckboxFieldProps extends FieldProps {
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Interfaz para campos de archivo
export interface FileFieldProps extends FieldProps {
  accept?: string;
  multiple?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  control: Control<FormData>;
}

// Interfaz para componentes de botón
export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}

// Interfaz para componentes de formulario
export interface FormProps {
  onSubmit: (data: any) => void;
  children: ReactNode;
  className?: string;
}

// Interfaz para componentes de error
export interface ErrorMessageProps {
  error?: string;
  className?: string;
}

// Interfaz para componentes de etiqueta
export interface LabelProps {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

// Interfaz para componentes de grupo de formulario
export interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

// Interfaz para componentes de pasos de formulario
export interface FormStepProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting?: boolean;
  isLastStep?: boolean;
}

// Interfaz para componentes de navegación de formulario
export interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  className?: string;
}
