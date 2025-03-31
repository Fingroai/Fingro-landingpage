// Tipos para los componentes de formulario
import { z } from 'zod';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors, Control } from 'react-hook-form';

// Tipos para los pasos del formulario basados en la estructura de 9 pasos
export interface FormStepProps {
  onSubmit: () => void;
  onBack?: () => void;
  isLastStep?: boolean;
}

// Tipos para los campos de formulario
export interface FormFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control?: Control<any>;
  watch?: UseFormWatch<any>;
  setValue?: UseFormSetValue<any>;
}

// Tipos para los campos específicos de cada paso
export interface Step1Fields {
  monto_solicitado: number;
  proposito: string;
}

export interface Step2Fields {
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date;
  dpi: string;
  correo: string;
  telefono: string;
  departamento: string;
  municipio: string;
  direccion: string;
}

export interface Step3Fields {
  tipo_vivienda: string;
}

export interface Step4Fields {
  nivel_educativo: string;
  institucion?: string;
  pais_estudios?: string;
  ano_graduacion?: number;
}

export interface Step5Fields {
  estado_laboral: string;
  empresa?: string;
  cargo?: string;
  antiguedad?: number;
  tipo_ingreso?: string;
  ingreso_mensual: number;
  otros_ingresos?: number;
}

export interface Step6Fields {
  posee_vehiculo: string;
  kilometraje?: number;
}

export interface Step7Fields {
  ahorros: number;
  cuentas_inversion?: number;
  nuevos_prestamos_3meses: boolean;
  otras_deudas: boolean;
  monto_deuda?: number;
  entidad?: string;
}

export interface Step8Fields {
  dpi_documento?: File;
  comprobante_ingresos?: File;
  recibo_servicios?: File;
}

export interface Step9Fields {
  acepto_terminos: boolean;
}

// Tipo para el formulario completo
export type FormData = 
  Step1Fields & 
  Step2Fields & 
  Step3Fields & 
  Step4Fields & 
  Step5Fields & 
  Step6Fields & 
  Step7Fields & 
  Step8Fields & 
  Step9Fields;

// Namespace para Zod
declare namespace z {
  export function object(shape: any): any;
  export function string(): any;
  export function number(): any;
  export function boolean(): any;
  export function date(): any;
  export function array(schema: any): any;
  export function any(): any;
  export function enumType(values: string[]): any;
}
