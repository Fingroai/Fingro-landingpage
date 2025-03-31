import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext } from './FormContext';

// Schema for this step
const stepSchema = z.object({
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
  ano_graduacion: z.number().optional()
});

type StepData = z.infer<typeof stepSchema>;

const FormStep4 = () => {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      nivel_educativo: formData.nivel_educativo,
      institucion: formData.institucion || '',
      pais_estudios: formData.pais_estudios || '',
      ano_graduacion: formData.ano_graduacion
    }
  });

  const nivelEducativo = watch('nivel_educativo');
  const mostrarCamposAdicionales = nivelEducativo && nivelEducativo !== 'Sin estudios';

  // Lista de países para el select
  const paises = [
    "Guatemala", "México", "Estados Unidos", "España", "Colombia", 
    "Argentina", "Chile", "Perú", "Ecuador", "Costa Rica", 
    "Panamá", "El Salvador", "Honduras", "Nicaragua", "Venezuela"
  ];

  // Actualizar datos cuando cambian los campos
  const onFormChange = (data: StepData) => {
    updateFormData(data);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">
        Información Educativa
      </h2>
      
      <form onChange={handleSubmit(onFormChange)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="nivel_educativo" className="form-label">
            Nivel Educativo
          </label>
          <Controller
            name="nivel_educativo"
            control={control}
            render={({ field }: { field: any }) => (
              <select
                {...field}
                className="form-input"
              >
                <option value="">Selecciona tu nivel educativo</option>
                <option value="Sin estudios">Sin estudios</option>
                <option value="Primaria">Primaria</option>
                <option value="Secundaria">Secundaria</option>
                <option value="Universidad incompleta">Universidad incompleta</option>
                <option value="Graduado universitario">Graduado universitario</option>
                <option value="Postgrado/Maestría">Postgrado/Maestría</option>
              </select>
            )}
          />
          {errors.nivel_educativo && (
            <p className="form-error">{errors.nivel_educativo.message}</p>
          )}
        </div>
        
        {mostrarCamposAdicionales && (
          <>
            <div className="space-y-2">
              <label htmlFor="institucion" className="form-label">
                Institución Educativa
              </label>
              <Controller
                name="institucion"
                control={control}
                render={({ field }: { field: any }) => (
                  <input
                    {...field}
                    type="text"
                    className="form-input"
                    placeholder="Nombre de la institución"
                  />
                )}
              />
              {errors.institucion && (
                <p className="form-error">{errors.institucion.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="pais_estudios" className="form-label">
                País de Estudios
              </label>
              <Controller
                name="pais_estudios"
                control={control}
                render={({ field }: { field: any }) => (
                  <select
                    {...field}
                    className="form-input"
                  >
                    <option value="">Selecciona un país</option>
                    {paises.map((pais) => (
                      <option key={pais} value={pais}>{pais}</option>
                    ))}
                  </select>
                )}
              />
              {errors.pais_estudios && (
                <p className="form-error">{errors.pais_estudios.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="ano_graduacion" className="form-label">
                Año de Graduación
              </label>
              <Controller
                name="ano_graduacion"
                control={control}
                render={({ field }: { field: any }) => (
                  <input
                    {...field}
                    type="number"
                    min="1950"
                    max={new Date().getFullYear()}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="form-input"
                    placeholder="Año"
                  />
                )}
              />
              {errors.ano_graduacion && (
                <p className="form-error">{errors.ano_graduacion.message}</p>
              )}
            </div>
          </>
        )}
        

      </form>
    </div>
  );
};

export default FormStep4;
