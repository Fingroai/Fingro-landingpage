import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext } from './FormContext';

// Schema for this step
const stepSchema = z.object({
  posee_vehiculo: z.enum([
    'Sí, pagado',
    'Sí, leasing',
    'Sí, con préstamo activo',
    'No'
  ], {
    errorMap: () => ({ message: "Selecciona una opción válida" })
  }),
  kilometraje: z.number().optional()
});

type StepData = z.infer<typeof stepSchema>;

const FormStep6 = () => {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      posee_vehiculo: formData.posee_vehiculo,
      kilometraje: formData.kilometraje
    }
  });

  const poseeVehiculo = watch('posee_vehiculo');
  const mostrarKilometraje = poseeVehiculo && poseeVehiculo !== 'No';

  // Actualizar datos cuando cambian los campos individuales
  const onFieldChange = (name: string, value: any) => {
    updateFormData({ [name]: value });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">
        Información de Vehículo
      </h2>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="posee_vehiculo" className="form-label">
            ¿Posee vehículo?
          </label>
          <Controller
            name="posee_vehiculo"
            control={control}
            render={({ field }: { field: any }) => (
              <select
                {...field}
                className="form-input"
                onChange={(e) => {
                  field.onChange(e);
                  onFieldChange('posee_vehiculo', e.target.value);
                  // Si selecciona No, establecer kilometraje como 0
                  if (e.target.value === 'No') {
                    onFieldChange('kilometraje', 0);
                  }
                }}
              >
                <option value="">Selecciona una opción</option>
                <option value="Sí, pagado">Sí, pagado</option>
                <option value="Sí, leasing">Sí, leasing</option>
                <option value="Sí, con préstamo activo">Sí, con préstamo activo</option>
                <option value="No">No</option>
              </select>
            )}
          />
          {errors.posee_vehiculo && (
            <p className="form-error">{errors.posee_vehiculo.message}</p>
          )}
        </div>
        
        {mostrarKilometraje && (
          <div className="space-y-2">
            <label htmlFor="kilometraje" className="form-label">
              Kilometraje actual
            </label>
            <Controller
              name="kilometraje"
              control={control}
              render={({ field }: { field: any }) => (
                <input
                  {...field}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : 0;
                    field.onChange(value);
                    onFieldChange('kilometraje', value);
                  }}
                  className="form-input"
                  placeholder="Kilometraje en km"
                  min="0"
                />
              )}
            />
            {errors.kilometraje && (
              <p className="form-error">{errors.kilometraje.message}</p>
            )}
          </div>
        )}
        

      </form>
    </div>
  );
};

export default FormStep6;
