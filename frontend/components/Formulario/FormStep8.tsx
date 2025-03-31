import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext } from './FormContext';

// Schema for this step - todos los documentos son opcionales
const stepSchema = z.object({
  dpi_documento: z.any().optional(),
  comprobante_ingresos: z.any().optional(),
  recibo_servicios: z.any().optional()
});

type StepData = {
  dpi_documento: FileList;
  comprobante_ingresos: FileList;
  recibo_servicios: FileList;
};

const FormStep8 = () => {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  
  // Estado para mostrar los nombres de archivos seleccionados
  const [fileNames, setFileNames] = useState({
    dpi_documento: '',
    comprobante_ingresos: '',
    recibo_servicios: ''
  });
  
  const { control, handleSubmit, formState: { errors } } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      dpi_documento: undefined,
      comprobante_ingresos: undefined,
      recibo_servicios: undefined
    }
  });

  const handleFileChange = (name: string, files: FileList | null) => {
    if (files && files.length > 0) {
      setFileNames(prev => ({
        ...prev,
        [name]: files[0].name
      }));
    }
  };

  // Actualizar datos cuando cambian los campos
  const onFormChange = () => {
    // En un caso real, aquí se subirían los archivos a Supabase Storage
    // y se guardarían las URLs en el estado del formulario
    
    // Por ahora, solo guardamos los nombres de los archivos para simular
    updateFormData({
      dpi_documento: fileNames.dpi_documento,
      comprobante_ingresos: fileNames.comprobante_ingresos,
      recibo_servicios: fileNames.recibo_servicios
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">
        Documentación
      </h2>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="dpi_documento" className="form-label">
            DPI/NIT (imagen o PDF)
          </label>
          <Controller
            name="dpi_documento"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <div className="flex items-center">
                <input
                  {...field}
                  id="dpi_documento"
                  type="file"
                  onChange={(e) => {
                    onChange(e.target.files);
                    handleFileChange('dpi_documento', e.target.files);
                  }}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                />
                <label
                  htmlFor="dpi_documento"
                  className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-l-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Seleccionar archivo
                </label>
                <span className="flex-1 px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm text-gray-500 truncate">
                  {fileNames.dpi_documento || "Ningún archivo seleccionado"}
                </span>
              </div>
            )}
          />
          {errors.dpi_documento && (
            <p className="form-error">{errors.dpi_documento.message as string}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="comprobante_ingresos" className="form-label">
            Comprobante de ingresos (imagen o PDF)
          </label>
          <Controller
            name="comprobante_ingresos"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <div className="flex items-center">
                <input
                  {...field}
                  id="comprobante_ingresos"
                  type="file"
                  onChange={(e) => {
                    onChange(e.target.files);
                    handleFileChange('comprobante_ingresos', e.target.files);
                  }}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                />
                <label
                  htmlFor="comprobante_ingresos"
                  className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-l-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Seleccionar archivo
                </label>
                <span className="flex-1 px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm text-gray-500 truncate">
                  {fileNames.comprobante_ingresos || "Ningún archivo seleccionado"}
                </span>
              </div>
            )}
          />
          {errors.comprobante_ingresos && (
            <p className="form-error">{errors.comprobante_ingresos.message as string}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="recibo_servicios" className="form-label">
            Recibo de servicios (imagen o PDF)
          </label>
          <Controller
            name="recibo_servicios"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <div className="flex items-center">
                <input
                  {...field}
                  id="recibo_servicios"
                  type="file"
                  onChange={(e) => {
                    onChange(e.target.files);
                    handleFileChange('recibo_servicios', e.target.files);
                  }}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                />
                <label
                  htmlFor="recibo_servicios"
                  className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-l-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Seleccionar archivo
                </label>
                <span className="flex-1 px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm text-gray-500 truncate">
                  {fileNames.recibo_servicios || "Ningún archivo seleccionado"}
                </span>
              </div>
            )}
          />
          {errors.recibo_servicios && (
            <p className="form-error">{errors.recibo_servicios.message as string}</p>
          )}
        </div>
        

      </form>
    </div>
  );
};

export default FormStep8;
