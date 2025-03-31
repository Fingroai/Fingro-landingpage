import React, { createContext, useContext, useState, ReactNode } from 'react';
import { z } from 'zod';

// Define the form schema
export const formSchema = z.object({
  // Step 1: Monto y Propósito
  monto_solicitado: z.number().min(1000, "El monto mínimo es de Q1,000").max(1000000, "El monto máximo es de Q1,000,000"),
  proposito: z.enum([
    'Compra de vehículo',
    'Consolidación de deudas',
    'Gastos médicos',
    'Mejoras del hogar',
    'Gastos personales',
    'Educación',
    'Capital de trabajo'
  ], {
    errorMap: () => ({ message: "Selecciona un propósito válido" })
  }),
  nit: z.string().min(8, "El NIT debe tener al menos 8 caracteres").max(15, "El NIT no puede tener más de 15 caracteres"),
  
  // Step 2: Datos personales
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  fecha_nacimiento: z.date(),
  dpi: z.string().min(13, "El DPI debe tener 13 dígitos").max(13, "El DPI debe tener 13 dígitos"),
  correo: z.string().email("Correo electrónico inválido"),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  departamento: z.string().min(1, "Selecciona un departamento"),
  municipio: z.string().min(1, "Selecciona un municipio"),
  direccion: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  
  // Step 3: Vivienda
  tipo_vivienda: z.enum([
    'Propia sin hipoteca',
    'Propia con hipoteca',
    'Rentada',
    'Otra'
  ], {
    errorMap: () => ({ message: "Selecciona un tipo de vivienda válido" })
  }),
  
  // Step 4: Educación
  nivel_educativo: z.enum([
    'Sin estudios',
    'Primaria',
    'Secundaria',
    'Universidad incompleta',
    'Graduado universitario',
    'Postgrado/Maestría'
  ], {
    errorMap: () => ({ message: "Selecciona un nivel educativo válido" })
  }),
  institucion: z.string().optional(),
  pais_estudios: z.string().optional(),
  ano_graduacion: z.number().optional(),
  
  // Step 5: Ingresos y empleo
  estado_laboral: z.enum([
    'Empleado',
    'Independiente',
    'Desempleado'
  ], {
    errorMap: () => ({ message: "Selecciona un estado laboral válido" })
  }),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  antiguedad: z.number().optional(),
  tipo_ingreso: z.string().optional(),
  ingreso_mensual: z.number().min(0, "El ingreso no puede ser negativo"),
  otros_ingresos: z.number().min(0, "Los otros ingresos no pueden ser negativos").optional(),
  
  // Step 6: Vehículo
  posee_vehiculo: z.enum([
    'Sí, pagado',
    'Sí, leasing',
    'Sí, con préstamo activo',
    'No'
  ], {
    errorMap: () => ({ message: "Selecciona una opción válida" })
  }),
  kilometraje: z.number().optional(),
  
  // Step 7: Situación financiera
  ahorros: z.number().min(0, "Los ahorros no pueden ser negativos"),
  cuentas_inversion: z.number().min(0, "Las cuentas de inversión no pueden ser negativas").optional(),
  nuevos_prestamos_3meses: z.boolean(),
  otras_deudas: z.boolean(),
  monto_deuda: z.number().optional(),
  entidad: z.string().optional(),
  
  // Step 8: Documentación - todos opcionales
  dpi_documento: z.any().optional(),
  comprobante_ingresos: z.any().optional(),
  recibo_servicios: z.any().optional(),
  
  // Step 9: Autorización
  acepto_terminos: z.boolean().refine((val: boolean) => val === true, {
    message: "Debes aceptar los términos y condiciones para continuar"
  })
});

// Definición de tipo para los datos del formulario
export type FormData = any; // Reemplazado temporalmente para evitar error de compilación

// Create initial form data
const initialFormData: Partial<FormData> = {
  // Step 1
  monto_solicitado: undefined,
  proposito: undefined,
  nit: '',
  
  // Step 2
  nombre: '',
  apellido: '',
  fecha_nacimiento: undefined,
  dpi: '',
  correo: '',
  telefono: '',
  departamento: '',
  municipio: '',
  direccion: '',
  
  // Step 3
  tipo_vivienda: undefined,
  
  // Step 4
  nivel_educativo: undefined,
  institucion: '',
  pais_estudios: '',
  ano_graduacion: undefined,
  
  // Step 5
  estado_laboral: undefined,
  empresa: '',
  cargo: '',
  antiguedad: undefined,
  tipo_ingreso: '',
  ingreso_mensual: undefined,
  otros_ingresos: 0,
  
  // Step 6
  posee_vehiculo: undefined,
  kilometraje: undefined,
  
  // Step 7
  ahorros: undefined,
  cuentas_inversion: 0,
  nuevos_prestamos_3meses: false,
  otras_deudas: false,
  monto_deuda: 0,
  entidad: '',
  
  // Step 8
  dpi_documento: '',
  comprobante_ingresos: '',
  recibo_servicios: '',
  
  // Step 9
  acepto_terminos: false
};

// Interface para el contexto del formulario
export interface FormContextType {
  formData: Partial<FormData>;
  updateFormData: (data: Partial<FormData>) => void;
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean | ((prevState: boolean) => boolean)) => void;
  isCurrentStepValid: () => boolean;
}

// Create form context
const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider = ({ children }: FormProviderProps) => {
  const [formData, setFormData] = useState<Partial<FormData>>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev: Partial<FormData>) => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    if (isCurrentStepValid()) {
      setCurrentStep((prev: number) => Math.min(prev + 1, 10));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev: number) => Math.max(prev - 1, 1));
  };
  
  // Función para validar el paso actual
  const isCurrentStepValid = (): boolean => {
    try {
      switch (currentStep) {
        case 1: // Monto y Propósito
          return !!formData.monto_solicitado && !!formData.proposito && 
                 !!formData.nit && formData.nit.length >= 8 && formData.nit.length <= 15;
        
        case 2: // Datos personales
          return !!formData.nombre && formData.nombre.length >= 2 &&
                 !!formData.apellido && formData.apellido.length >= 2 &&
                 !!formData.fecha_nacimiento &&
                 !!formData.dpi && formData.dpi.length === 13 &&
                 !!formData.correo && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo) &&
                 !!formData.telefono && formData.telefono.length >= 8 &&
                 !!formData.departamento &&
                 !!formData.municipio &&
                 !!formData.direccion && formData.direccion.length >= 5;
        
        case 3: // Vivienda
          return !!formData.tipo_vivienda;
        
        case 4: // Educación
          return !!formData.nivel_educativo;
        
        case 5: // Ingresos y empleo
          return !!formData.estado_laboral && 
                 (formData.ingreso_mensual !== undefined && formData.ingreso_mensual >= 0) &&
                 (formData.estado_laboral === 'Desempleado' || 
                  (!!formData.empresa && !!formData.tipo_ingreso));
        
        case 6: // Vehículo
          return !!formData.posee_vehiculo && 
                 (formData.posee_vehiculo === 'No' || 
                  (formData.kilometraje !== undefined && formData.kilometraje >= 0));
        
        case 7: // Situación financiera
          return (formData.ahorros !== undefined && formData.ahorros >= 0) &&
                 formData.nuevos_prestamos_3meses !== undefined &&
                 formData.otras_deudas !== undefined;
        
        case 8: // Documentación - todos opcionales
          return true;
        
        case 9: // Resumen
          return true;
        
        case 10: // Autorización
          return !!formData.acepto_terminos;
        
        default:
          return false;
      }
    } catch (error) {
      console.error('Error validating step:', error);
      return false;
    }
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        totalSteps: 10,
        goToNextStep,
        goToPreviousStep,
        isSubmitting,
        setIsSubmitting,
        isCurrentStepValid,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
