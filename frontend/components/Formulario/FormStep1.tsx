import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext } from './FormContext';
import { formatCurrency, parseCurrency } from '../../utils/formatters';

// Schema for this step
const stepSchema = z.object({
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
  nit: z.string().min(8, "El NIT debe tener al menos 8 caracteres").max(15, "El NIT no puede tener más de 15 caracteres")
});

type StepData = z.infer<typeof stepSchema>;

const FormStep1 = () => {
  const { formData, updateFormData, goToNextStep } = useFormContext();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      monto_solicitado: formData.monto_solicitado,
      proposito: formData.proposito,
      nit: formData.nit || ''
    }
  });

  // Actualizar datos cuando cambian los campos individuales
  const onFieldChange = (name: string, value: string | number | boolean) => {
    updateFormData({ [name]: value });
  };
  
  // Estado para el valor formateado del monto
  const [formattedAmount, setFormattedAmount] = useState(
    formatCurrency(formData.monto_solicitado || 0)
  );

  return (
    <div className="max-w-md mx-auto p-3 sm:p-6 bg-white rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-primary-700">
        Monto y Propósito del Crédito
      </h2>
      
      <form className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <label htmlFor="monto_solicitado" className="form-label text-sm sm:text-base">
            Monto solicitado (Q)
          </label>
          <Controller
            name="monto_solicitado"
            control={control}
            render={({ field }: { field: any }) => (
              <div className="relative">
                <input
                  type="text"
                  value={formattedAmount}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Permitir solo números, comas, puntos y el símbolo Q
                    if (/^[Q\s\d,.]*$/.test(inputValue)) {
                      setFormattedAmount(inputValue);
                      // Convertir el valor formateado a número para el formulario
                      const numericValue = parseCurrency(inputValue);
                      field.onChange(numericValue);
                      onFieldChange('monto_solicitado', numericValue);
                    }
                  }}
                  onBlur={() => {
                    // Al perder el foco, asegurar que el formato sea correcto
                    const numericValue = parseCurrency(formattedAmount);
                    setFormattedAmount(formatCurrency(numericValue));
                  }}
                  className="form-input pl-8 text-sm sm:text-base h-10 sm:h-auto"
                  placeholder="Ingresa el monto que necesitas"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  Q
                </div>
              </div>
            )}
          />
          {errors.monto_solicitado && (
            <p className="form-error text-xs sm:text-sm">{errors.monto_solicitado.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="proposito" className="form-label text-sm sm:text-base">
            Propósito del crédito
          </label>
          <Controller
            name="proposito"
            control={control}
            render={({ field }: { field: any }) => (
              <select
                {...field}
                className="form-input text-sm sm:text-base h-10 sm:h-auto"
                onChange={(e) => {
                  field.onChange(e);
                  onFieldChange('proposito', e.target.value);
                }}
              >
                <option value="">Selecciona un propósito</option>
                <option value="Compra de vehículo">Compra de vehículo</option>
                <option value="Consolidación de deudas">Consolidación de deudas</option>
                <option value="Gastos médicos">Gastos médicos</option>
                <option value="Mejoras del hogar">Mejoras del hogar</option>
                <option value="Gastos personales">Gastos personales</option>
                <option value="Educación">Educación</option>
                <option value="Capital de trabajo">Capital de trabajo</option>
              </select>
            )}
          />
          {errors.proposito && (
            <p className="form-error text-xs sm:text-sm">{errors.proposito.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="nit" className="form-label text-sm sm:text-base">
            NIT (Número de Identificación Tributaria)
          </label>
          <Controller
            name="nit"
            control={control}
            render={({ field }: { field: any }) => (
              <input
                {...field}
                type="text"
                onChange={(e) => {
                  field.onChange(e);
                  onFieldChange('nit', e.target.value);
                }}
                className="form-input text-sm sm:text-base h-10 sm:h-auto"
                placeholder="Ingresa tu NIT"
              />
            )}
          />
          {errors.nit && (
            <p className="form-error text-xs sm:text-sm">{errors.nit.message}</p>
          )}
        </div>

      </form>
    </div>
  );
};

export default FormStep1;
