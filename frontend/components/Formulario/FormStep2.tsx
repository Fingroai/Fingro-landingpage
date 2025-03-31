import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext } from './FormContext';
import { departamentos, municipiosPorDepartamento } from '../../utils/municipios';

// Schema for this step
const stepSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  fecha_nacimiento: z.string().refine(date => {
    const dateObj = new Date(date);
    const today = new Date();
    const minAge = new Date();
    minAge.setFullYear(today.getFullYear() - 18);
    return dateObj <= minAge;
  }, { message: "Debes ser mayor de 18 años" }),
  dpi: z.string().min(13, "El DPI debe tener 13 dígitos").max(13, "El DPI debe tener 13 dígitos"),
  correo: z.string().email("Correo electrónico inválido"),
  telefono: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  departamento: z.string().min(1, "Selecciona un departamento"),
  municipio: z.string().min(1, "Selecciona un municipio"),
  direccion: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
});

type StepData = z.infer<typeof stepSchema>;

const FormStep2 = () => {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      nombre: formData.nombre || '',
      apellido: formData.apellido || '',
      fecha_nacimiento: formData.fecha_nacimiento ? new Date(formData.fecha_nacimiento).toISOString().split('T')[0] : '',
      dpi: formData.dpi || '',
      correo: formData.correo || '',
      telefono: formData.telefono || '',
      departamento: formData.departamento || '',
      municipio: formData.municipio || '',
      direccion: formData.direccion || ''
    }
  });

  // Utilizamos los datos importados de municipios.ts
  // departamentos y municipiosPorDepartamento ya están importados

  const selectedDepartamento = watch('departamento');
  const municipios = selectedDepartamento ? municipiosPorDepartamento[selectedDepartamento] || [] : [];

  // Actualizar datos cuando cambian los campos individuales
  const onFieldChange = (name: string, value: string | number | boolean | Date) => {
    if (name === 'fecha_nacimiento' && typeof value === 'string') {
      value = new Date(value);
    }
    updateFormData({ [name]: value });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">
        Datos Personales
      </h2>
      
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <Controller
              name="nombre"
              control={control}
              render={({ field }: { field: any }) => (
                <input
                  {...field}
                  type="text"
                  className="form-input"
                  placeholder="Tu nombre"
                  onChange={(e) => {
                    field.onChange(e);
                    onFieldChange('nombre', e.target.value);
                  }}
                />
              )}
            />
            {errors.nombre && (
              <p className="form-error">{errors.nombre.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="apellido" className="form-label">
              Apellido
            </label>
            <Controller
              name="apellido"
              control={control}
              render={({ field }: { field: any }) => (
                <input
                  {...field}
                  type="text"
                  className="form-input"
                  placeholder="Tu apellido"
                  onChange={(e) => {
                    field.onChange(e);
                    onFieldChange('apellido', e.target.value);
                  }}
                />
              )}
            />
            {errors.apellido && (
              <p className="form-error">{errors.apellido.message}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="fecha_nacimiento" className="form-label">
            Fecha de Nacimiento
          </label>
          <Controller
            name="fecha_nacimiento"
            control={control}
            render={({ field }: { field: any }) => (
              <input
                {...field}
                type="date"
                className="form-input"
                onChange={(e) => {
                  field.onChange(e);
                  onFieldChange('fecha_nacimiento', e.target.value);
                }}
              />
            )}
          />
          {errors.fecha_nacimiento && (
            <p className="form-error">{errors.fecha_nacimiento.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="dpi" className="form-label">
            DPI
          </label>
          <Controller
            name="dpi"
            control={control}
            render={({ field }: { field: any }) => (
              <input
                {...field}
                type="text"
                className="form-input"
                placeholder="Número de DPI (13 dígitos)"
                onChange={(e) => {
                  field.onChange(e);
                  onFieldChange('dpi', e.target.value);
                }}
              />
            )}
          />
          {errors.dpi && (
            <p className="form-error">{errors.dpi.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="correo" className="form-label">
            Correo Electrónico
          </label>
          <Controller
            name="correo"
            control={control}
            render={({ field }: { field: any }) => (
              <input
                {...field}
                type="email"
                className="form-input"
                placeholder="tu@correo.com"
                onChange={(e) => {
                  field.onChange(e);
                  onFieldChange('correo', e.target.value);
                }}
              />
            )}
          />
          {errors.correo && (
            <p className="form-error">{errors.correo.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="telefono" className="form-label">
            Teléfono
          </label>
          <Controller
            name="telefono"
            control={control}
            render={({ field }: { field: any }) => (
              <input
                {...field}
                type="tel"
                className="form-input"
                placeholder="Número de teléfono"
                onChange={(e) => {
                  field.onChange(e);
                  onFieldChange('telefono', e.target.value);
                }}
              />
            )}
          />
          {errors.telefono && (
            <p className="form-error">{errors.telefono.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="departamento" className="form-label">
              Departamento
            </label>
            <Controller
              name="departamento"
              control={control}
              render={({ field }: { field: any }) => (
                <select
                  {...field}
                  className="form-input"
                  onChange={(e) => {
                    field.onChange(e);
                    onFieldChange('departamento', e.target.value);
                  }}
                >
                  <option value="">Seleccionar</option>
                  {departamentos.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              )}
            />
            {errors.departamento && (
              <p className="form-error">{errors.departamento.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="municipio" className="form-label">
              Municipio
            </label>
            <Controller
              name="municipio"
              control={control}
              render={({ field }: { field: any }) => (
                <select
                  {...field}
                  className="form-input"
                  disabled={!selectedDepartamento}
                  onChange={(e) => {
                    field.onChange(e);
                    onFieldChange('municipio', e.target.value);
                  }}
                >
                  <option value="">Seleccionar</option>
                  {municipios.map((mun) => (
                    <option key={mun} value={mun}>{mun}</option>
                  ))}
                </select>
              )}
            />
            {errors.municipio && (
              <p className="form-error">{errors.municipio.message}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="direccion" className="form-label">
            Dirección
          </label>
          <Controller
            name="direccion"
            control={control}
            render={({ field }: { field: any }) => (
              <textarea
                {...field}
                rows={3}
                className="form-input"
                placeholder="Tu dirección completa"
                onChange={(e) => {
                  field.onChange(e);
                  onFieldChange('direccion', e.target.value);
                }}
              />
            )}
          />
          {errors.direccion && (
            <p className="form-error">{errors.direccion.message}</p>
          )}
        </div>
        

      </form>
    </div>
  );
};

export default FormStep2;
