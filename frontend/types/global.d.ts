// Type declarations for modules without type definitions

// Declare modules for which we don't have type definitions
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

// Add JSX IntrinsicElements interface to fix JSX element errors
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Extend File interface for file uploads
interface File {
  preview?: string;
}

// Ensure process.env is available
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_API_URL: string;
    [key: string]: string | undefined;
  }
}

// Type definitions for form components
interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  children?: React.ReactNode;
}

interface FormInputProps extends FormFieldProps {
  type?: string;
  placeholder?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

interface FormSelectProps extends FormFieldProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}

interface FormRadioProps extends FormFieldProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FormCheckboxProps extends FormFieldProps {
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FormFileProps extends FormFieldProps {
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: File | null;
  preview?: string;
}

// Fix for CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
