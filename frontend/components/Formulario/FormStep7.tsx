import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext } from './FormContext';
import { formatCurrency, parseCurrency } from '../../utils/formatters';

// Schema for this step
const stepSchema = z.object({
  ahorros: z.number().min(0, "Los ahorros no pueden ser negativos"),
  cuentas_inversion: z.number().min(0, "Las cuentas de inversión no pueden ser negativas").optional(),
  nuevos_prestamos_3meses: z.boolean(),
  otras_deudas: z.boolean(),
  monto_deuda: z.number().optional(),
  entidad: z.string().optional()
});

type StepData = z.infer<typeof stepSchema>;

const FormStep7 = () => {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      ahorros: formData.ahorros,
      cuentas_inversion: formData.cuentas_inversion || 0,
      nuevos_prestamos_3meses: formData.nuevos_prestamos_3meses || false,
      otras_deudas: formData.otras_deudas || false,
      monto_deuda: formData.monto_deuda || 0,
      entidad: formData.entidad || ''
    }
  });

  const otrasDeudas = watch('otras_deudas');

  // Actualizar datos cuando cambian los campos individuales
  const onFieldChange = (name: string, value: string | number | boolean) => {
    updateFormData({ [name]: value });
  };
  
  // Estados para los valores formateados
  const [formattedSavings, setFormattedSavings] = useState(
    formatCurrency(formData.ahorros || 0)
  );
  
  const [formattedInvestments, setFormattedInvestments] = useState(
    formatCurrency(formData.cuentas_inversion || 0)
  );
  
  const [formattedDebt, setFormattedDebt] = useState(
    formatCurrency(formData.monto_deuda || 0)
  );
  
  // Asegurar que los valores iniciales se carguen en el contexto del formulario
  useEffect(() => {
    // Asegurar que los valores booleanos estén definidos
    if (formData.nuevos_prestamos_3meses === undefined) {
      updateFormData({ nuevos_prestamos_3meses: false });
    }
    if (formData.otras_deudas === undefined) {
      updateFormData({ otras_deudas: false });
    }
    if (formData.ahorros === undefined) {
      updateFormData({ ahorros: 0 });
    }
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">
        Situación Financiera
      </h2>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="ahorros" className="form-label">
            Ahorros
          </label>
          <Controller
            name="ahorros"
            control={control}
            render={({ field }: { field: any }) => (
              <div className="relative">
                <input
                  type="text"
                  value={formattedSavings}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Permitir solo números, comas, puntos y el símbolo Q
                    if (/^[Q\s\d,.]*$/.test(inputValue)) {
                      setFormattedSavings(inputValue);
                      // Convertir el valor formateado a número para el formulario
                      const numericValue = parseCurrency(inputValue);
                      field.onChange(numericValue);
                      onFieldChange('ahorros', numericValue);
                    }
                  }}
                  onBlur={() => {
                    // Al perder el foco, asegurar que el formato sea correcto
                    const numericValue = parseCurrency(formattedSavings);
                    setFormattedSavings(formatCurrency(numericValue));
                  }}
                  className="form-input pl-8"
                  placeholder="Monto de tus ahorros"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  Q
                </div>
              </div>
            )}
          />
          {errors.ahorros && (
            <p className="form-error">{errors.ahorros.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="cuentas_inversion" className="form-label">
            Cuentas de Inversión (opcional)
          </label>
          <Controller
            name="cuentas_inversion"
            control={control}
            render={({ field }: { field: any }) => (
              <div className="relative">
                <input
                  type="text"
                  value={formattedInvestments}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Permitir solo números, comas, puntos y el símbolo Q
                    if (/^[Q\s\d,.]*$/.test(inputValue)) {
                      setFormattedInvestments(inputValue);
                      // Convertir el valor formateado a número para el formulario
                      const numericValue = parseCurrency(inputValue);
                      field.onChange(numericValue);
                      onFieldChange('cuentas_inversion', numericValue);
                    }
                  }}
                  onBlur={() => {
                    // Al perder el foco, asegurar que el formato sea correcto
                    const numericValue = parseCurrency(formattedInvestments);
                    setFormattedInvestments(formatCurrency(numericValue));
                  }}
                  className="form-input pl-8"
                  placeholder="Monto en inversiones"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  Q
                </div>
              </div>
            )}
          />
          {errors.cuentas_inversion && (
            <p className="form-error">{errors.cuentas_inversion.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="form-label">
            ¿Has solicitado nuevos préstamos en los últimos 3 meses?
          </label>
          <Controller
            name="nuevos_prestamos_3meses"
            control={control}
            render={({ field }: { field: any }) => (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="prestamos-si"
                    checked={field.value === true}
                    onChange={() => {
                      field.onChange(true);
                      onFieldChange('nuevos_prestamos_3meses', true);
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="prestamos-si" className="ml-2 block text-sm text-gray-700">
                    Sí
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="prestamos-no"
                    checked={field.value === false}
                    onChange={() => {
                      field.onChange(false);
                      onFieldChange('nuevos_prestamos_3meses', false);
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="prestamos-no" className="ml-2 block text-sm text-gray-700">
                    No
                  </label>
                </div>
              </div>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <label className="form-label">
            ¿Tienes otras deudas actualmente?
          </label>
          <Controller
            name="otras_deudas"
            control={control}
            render={({ field }: { field: any }) => (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="deudas-si"
                    checked={field.value === true}
                    onChange={() => {
                      field.onChange(true);
                      onFieldChange('otras_deudas', true);
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="deudas-si" className="ml-2 block text-sm text-gray-700">
                    Sí
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="deudas-no"
                    checked={field.value === false}
                    onChange={() => {
                      field.onChange(false);
                      onFieldChange('otras_deudas', false);
                      // Si selecciona No, establecer valores por defecto para los campos de deuda
                      onFieldChange('monto_deuda', 0);
                      onFieldChange('entidad', 'N/A');
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="deudas-no" className="ml-2 block text-sm text-gray-700">
                    No
                  </label>
                </div>
              </div>
            )}
          />
        </div>
        
        {otrasDeudas && (
          <>
            <div className="space-y-2">
              <label htmlFor="monto_deuda" className="form-label">
                Monto total de deudas (Q)
              </label>
              <Controller
                name="monto_deuda"
                control={control}
                render={({ field }: { field: any }) => (
                  <input
                    {...field}
                    type="number"
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : 0;
                      field.onChange(value);
                      onFieldChange('monto_deuda', value);
                    }}
                    className="form-input"
                    placeholder="Monto total de deudas"
                    min="0"
                  />
                )}
              />
              {errors.monto_deuda && (
                <p className="form-error">{errors.monto_deuda.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="entidad" className="form-label">
                Entidad financiera principal
              </label>
              <Controller
                name="entidad"
                control={control}
                render={({ field }: { field: any }) => (
                  <input
                    {...field}
                    type="text"
                    className="form-input"
                    placeholder="Nombre de la entidad"
                    onChange={(e) => {
                      field.onChange(e);
                      onFieldChange('entidad', e.target.value);
                    }}
                  />
                )}
              />
              {errors.entidad && (
                <p className="form-error">{errors.entidad.message}</p>
              )}
            </div>
          </>
        )}
        


      </form>
    </div>
  );
};

export default FormStep7;
