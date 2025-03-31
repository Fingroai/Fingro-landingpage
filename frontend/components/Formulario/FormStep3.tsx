import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext } from './FormContext';

// Schema for this step
const stepSchema = z.object({
  tipo_vivienda: z.enum([
    'Propia sin hipoteca',
    'Propia con hipoteca',
    'Rentada',
    'Otra'
  ], {
    errorMap: () => ({ message: "Selecciona un tipo de vivienda válido" })
  })
});

type StepData = z.infer<typeof stepSchema>;

const FormStep3 = () => {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  
  const { control, handleSubmit, formState: { errors } } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      tipo_vivienda: formData.tipo_vivienda
    }
  });

  // Actualizar datos cuando cambian los campos individuales
  const onFieldChange = (name: string, value: any) => {
    updateFormData({ [name]: value });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">
        Información de Vivienda
      </h2>
      
      <form className="space-y-6">
        <div className="space-y-4">
          <label className="form-label">
            Tipo de Vivienda
          </label>
          
          <Controller
            name="tipo_vivienda"
            control={control}
            render={({ field }: { field: any }) => (
              <div className="space-y-3">
                {['Propia sin hipoteca', 'Propia con hipoteca', 'Rentada', 'Otra'].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="radio"
                      id={option}
                      value={option}
                      checked={field.value === option}
                      onChange={() => {
                        field.onChange(option);
                        onFieldChange('tipo_vivienda', option);
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor={option} className="ml-3 block text-sm font-medium text-gray-700">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
          />
          {errors.tipo_vivienda && (
            <p className="form-error">{errors.tipo_vivienda.message}</p>
          )}
        </div>
        

      </form>
    </div>
  );
};

export default FormStep3;
