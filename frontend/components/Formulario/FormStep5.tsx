import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext } from './FormContext';
import { formatCurrency, parseCurrency } from '../../utils/formatters';

// Schema for this step
const stepSchema = z.object({
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
  otros_ingresos: z.number().min(0, "Los otros ingresos no pueden ser negativos").optional()
});

type StepData = z.infer<typeof stepSchema>;

const FormStep5 = () => {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      estado_laboral: formData.estado_laboral,
      empresa: formData.empresa || '',
      cargo: formData.cargo || '',
      antiguedad: formData.antiguedad,
      tipo_ingreso: formData.tipo_ingreso || '',
      ingreso_mensual: formData.ingreso_mensual,
      otros_ingresos: formData.otros_ingresos || 0
    }
  });

  const estadoLaboral = watch('estado_laboral');
  const mostrarCamposEmpleo = estadoLaboral === 'Empleado' || estadoLaboral === 'Independiente';

  // Tipos de ingreso
  const tiposIngreso = [
    "Salario fijo",
    "Salario variable",
    "Honorarios profesionales",
    "Ingresos por negocio propio",
    "Comisiones",
    "Rentas",
    "Jubilación/Pensión",
    "Otro"
  ];

  // Actualizar datos cuando cambian los campos
  const onFormChange = (data: StepData) => {
    updateFormData(data);
  };
  
  // Estados para los valores formateados
  const [formattedIncome, setFormattedIncome] = useState(
    formatCurrency(formData.ingreso_mensual || 0)
  );
  
  const [formattedOtherIncome, setFormattedOtherIncome] = useState(
    formatCurrency(formData.otros_ingresos || 0)
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">
        Ingresos y Empleo
      </h2>
      
      <form onChange={handleSubmit(onFormChange)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="estado_laboral" className="form-label">
            Estado Laboral
          </label>
          <Controller
            name="estado_laboral"
            control={control}
            render={({ field }: { field: any }) => (
              <select
                {...field}
                className="form-input"
              >
                <option value="">Selecciona tu estado laboral</option>
                <option value="Empleado">Empleado</option>
                <option value="Independiente">Independiente</option>
                <option value="Desempleado">Desempleado</option>
              </select>
            )}
          />
          {errors.estado_laboral && (
            <p className="form-error">{errors.estado_laboral.message}</p>
          )}
        </div>
        
        {mostrarCamposEmpleo && (
          <>
            <div className="space-y-2">
              <label htmlFor="empresa" className="form-label">
                {estadoLaboral === 'Empleado' ? 'Empresa donde trabajas' : 'Nombre de tu negocio/actividad'}
              </label>
              <Controller
                name="empresa"
                control={control}
                render={({ field }: { field: any }) => (
                  <input
                    {...field}
                    type="text"
                    className="form-input"
                    placeholder={estadoLaboral === 'Empleado' ? 'Nombre de la empresa' : 'Nombre de tu negocio'}
                  />
                )}
              />
              {errors.empresa && (
                <p className="form-error">{errors.empresa.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="cargo" className="form-label">
                {estadoLaboral === 'Empleado' ? 'Cargo' : 'Actividad principal'}
              </label>
              <Controller
                name="cargo"
                control={control}
                render={({ field }: { field: any }) => (
                  <input
                    {...field}
                    type="text"
                    className="form-input"
                    placeholder={estadoLaboral === 'Empleado' ? 'Tu cargo o puesto' : 'Actividad que realizas'}
                  />
                )}
              />
              {errors.cargo && (
                <p className="form-error">{errors.cargo.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="antiguedad" className="form-label">
                {estadoLaboral === 'Empleado' ? 'Antigüedad en meses' : 'Tiempo de operación en meses'}
              </label>
              <Controller
                name="antiguedad"
                control={control}
                render={({ field }: { field: any }) => (
                  <input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    className="form-input"
                    placeholder="Meses"
                    min="0"
                  />
                )}
              />
              {errors.antiguedad && (
                <p className="form-error">{errors.antiguedad.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tipo_ingreso" className="form-label">
                Tipo de Ingreso
              </label>
              <Controller
                name="tipo_ingreso"
                control={control}
                render={({ field }: { field: any }) => (
                  <select
                    {...field}
                    className="form-input"
                  >
                    <option value="">Selecciona el tipo de ingreso</option>
                    {tiposIngreso.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                )}
              />
              {errors.tipo_ingreso && (
                <p className="form-error">{errors.tipo_ingreso.message}</p>
              )}
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <label htmlFor="ingreso_mensual" className="form-label">
            Ingreso Mensual
          </label>
          <Controller
            name="ingreso_mensual"
            control={control}
            render={({ field }: { field: any }) => (
              <div className="relative">
                <input
                  type="text"
                  value={formattedIncome}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Permitir solo números, comas, puntos y el símbolo Q
                    if (/^[Q\s\d,.]*$/.test(inputValue)) {
                      setFormattedIncome(inputValue);
                      // Convertir el valor formateado a número para el formulario
                      const numericValue = parseCurrency(inputValue);
                      field.onChange(numericValue);
                    }
                  }}
                  onBlur={() => {
                    // Al perder el foco, asegurar que el formato sea correcto
                    const numericValue = parseCurrency(formattedIncome);
                    setFormattedIncome(formatCurrency(numericValue));
                  }}
                  className="form-input pl-8"
                  placeholder="Ingreso mensual"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  Q
                </div>
              </div>
            )}
          />
          {errors.ingreso_mensual && (
            <p className="form-error">{errors.ingreso_mensual.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="otros_ingresos" className="form-label">
            Otros Ingresos Mensuales (opcional)
          </label>
          <Controller
            name="otros_ingresos"
            control={control}
            render={({ field }: { field: any }) => (
              <div className="relative">
                <input
                  type="text"
                  value={formattedOtherIncome}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Permitir solo números, comas, puntos y el símbolo Q
                    if (/^[Q\s\d,.]*$/.test(inputValue)) {
                      setFormattedOtherIncome(inputValue);
                      // Convertir el valor formateado a número para el formulario
                      const numericValue = parseCurrency(inputValue);
                      field.onChange(numericValue);
                    }
                  }}
                  onBlur={() => {
                    // Al perder el foco, asegurar que el formato sea correcto
                    const numericValue = parseCurrency(formattedOtherIncome);
                    setFormattedOtherIncome(formatCurrency(numericValue));
                  }}
                  className="form-input pl-8"
                  placeholder="Otros ingresos mensuales"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  Q
                </div>
              </div>
            )}
          />
          {errors.otros_ingresos && (
            <p className="form-error">{errors.otros_ingresos.message}</p>
          )}
        </div>
        

      </form>
    </div>
  );
};

export default FormStep5;
