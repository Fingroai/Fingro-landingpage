import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext } from './FormContext';
import { useRouter } from 'next/router';
import { submitFormData } from '@/lib/api';

// Schema for this step
const stepSchema = z.object({
  acepto_terminos: z.boolean()
    .refine(val => val === true, {
      message: "Debes aceptar los términos y condiciones para continuar"
    })
});

type StepData = z.infer<typeof stepSchema>;

const FormStep9 = () => {
  const { formData, updateFormData, goToPreviousStep } = useFormContext();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<StepData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      acepto_terminos: formData.acepto_terminos || false
    }
  });

  // Actualizar datos cuando cambian los campos
  const onFormChange = (data: StepData) => {
    updateFormData(data);
  };
  
  // Función para enviar el formulario completo
  const submitForm = async () => {
    // Preparar todos los datos del formulario para enviar
    const completeFormData = {
      ...formData
    };
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // En un caso real, aquí se enviarían los datos al backend
      // const response = await submitFormData(completeFormData);
      
      // Simulamos una respuesta exitosa después de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir a la página de ofertas con un ID simulado
      router.push('/ofertas?id=123456');
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
      setError('Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">
        Autorización
      </h2>
      
      <form onChange={handleSubmit(onFormChange)} className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="font-medium text-lg mb-2">Términos y Condiciones</h3>
            <div className="text-sm text-gray-600 h-48 overflow-y-auto p-2">
              <p className="mb-2">
                Al utilizar la plataforma Fingro, usted acepta los siguientes términos y condiciones:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Autorizo a Fingro a recopilar, almacenar y procesar mis datos personales con el fin de evaluar mi solicitud de crédito.
                </li>
                <li>
                  Autorizo a Fingro a compartir mis datos con las instituciones financieras participantes para que puedan evaluar mi solicitud y presentar ofertas.
                </li>
                <li>
                  Declaro que toda la información proporcionada es verídica y completa. Entiendo que proporcionar información falsa puede resultar en el rechazo de mi solicitud.
                </li>
                <li>
                  Autorizo a Fingro y a las instituciones financieras participantes a verificar mi historial crediticio y a consultar bureaus de crédito.
                </li>
                <li>
                  Entiendo que Fingro no garantiza la aprobación de mi solicitud de crédito y que las decisiones finales son tomadas por las instituciones financieras.
                </li>
                <li>
                  Acepto recibir comunicaciones relacionadas con mi solicitud de crédito por correo electrónico, teléfono o mensajes de texto.
                </li>
                <li>
                  Entiendo que puedo retirar mi consentimiento en cualquier momento, pero esto podría afectar la capacidad de Fingro para procesar mi solicitud.
                </li>
              </ol>
            </div>
          </div>
          
          <div className="flex items-start">
            <Controller
              name="acepto_terminos"
              control={control}
              render={({ field }: { field: any }) => (
                <div className="flex items-center h-5">
                  <input
                    id="acepto_terminos"
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              )}
            />
            <div className="ml-3 text-sm">
              <label htmlFor="acepto_terminos" className="font-medium text-gray-700">
                Acepto los términos y condiciones
              </label>
              <p className="text-gray-500">
                Al marcar esta casilla, confirmo que he leído y acepto los términos y condiciones.
              </p>
            </div>
          </div>
          
          {errors.acepto_terminos && (
            <p className="form-error">{errors.acepto_terminos.message}</p>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </div>
        

      </form>
    </div>
  );
};

export default FormStep9;
