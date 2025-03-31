import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { guardarSolicitud } from '../services/solicitudService';
import FormStep1 from '../components/Formulario/FormStep1';
import FormStep2 from '../components/Formulario/FormStep2';
import FormStep3 from '../components/Formulario/FormStep3';
import FormStep4 from '../components/Formulario/FormStep4';
import FormStep5 from '../components/Formulario/FormStep5';
import FormStep6 from '../components/Formulario/FormStep6';
import FormStep7 from '../components/Formulario/FormStep7';
import FormStep8 from '../components/Formulario/FormStep8';
import FormStep9 from '../components/Formulario/FormStep9';
import FormProgress from '../components/Formulario/FormProgress';
import FormNavigation from '../components/Formulario/FormNavigation';
import FormSummary from '../components/Formulario/FormSummary';
import { FormProvider, useFormContext } from '../components/Formulario/FormContext';

// Componente interno para el contenido del formulario
const FormularioContent = () => {
  const router = useRouter();
  const { formData, currentStep, totalSteps, goToNextStep, goToPreviousStep, isSubmitting, setIsSubmitting, isCurrentStepValid } = useFormContext();

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleSubmit = async () => {
    // Mostrar estado de envío
    setIsSubmitting(true);
    
    try {
      // Guardar el email para mostrarlo en el mensaje de éxito
      setUserEmail(formData.correo);
      
      // Enviar los datos del formulario a Supabase
      const { data, error } = await guardarSolicitud(formData);
      
      if (error) {
        throw error;
      }
      
      console.log('Solicitud guardada con éxito:', data);
      
      // Mostrar mensaje de éxito
      setSubmitSuccess(true);
      
      // Esperar 5 segundos antes de redirigir
      setTimeout(() => {
        router.push('/ofertas');
      }, 5000);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un error al enviar el formulario. Por favor, intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <FormStep1 />;
      case 2:
        return <FormStep2 />;
      case 3:
        return <FormStep3 />;
      case 4:
        return <FormStep4 />;
      case 5:
        return <FormStep5 />;
      case 6:
        return <FormStep6 />;
      case 7:
        return <FormStep7 />;
      case 8:
        return <FormStep8 />;
      case 9:
        return <FormSummary />;
      case 10:
        return <FormStep9 />;
      default:
        return <FormStep1 />;
    }
  };

  const stepTitles = [
    'Monto y Propósito',
    'Datos Personales',
    'Vivienda',
    'Educación',
    'Ingresos y Empleo',
    'Vehículo',
    'Situación Financiera',
    'Documentación',
    'Resumen',
    'Autorización'
  ];

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      goToNextStep();
      window.scrollTo(0, 0);
    } else if (currentStep === totalSteps) {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      goToPreviousStep();
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Head>
        <title>Solicitud de Crédito | Fingro</title>
        <meta name="description" content="Completa tu solicitud de crédito en Fingro" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-6 sm:py-12">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
          {submitSuccess ? (
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-green-100 p-3">
                  <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">¡Solicitud enviada con éxito!</h2>
              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                Hemos enviado un enlace a <strong>{userEmail}</strong> para que puedas acceder a tus ofertas personalizadas.
                Por favor, revisa tu correo electrónico y haz clic en el enlace para ver las ofertas que los bancos te ofrecerán.
              </p>
              <p className="text-gray-500 text-sm mb-4">Serás redirigido automáticamente en unos segundos...</p>
              <button
                onClick={() => router.push('/ofertas')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto justify-center"
              >
                Ver mis ofertas
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">Solicitud de Crédito</h1>
                <p className="mt-2 text-center text-gray-600 text-sm sm:text-base px-2">
                  Completa el formulario para recibir ofertas personalizadas
                </p>
              </div>

              <FormProgress currentStep={currentStep} totalSteps={totalSteps} stepTitles={stepTitles} />

              <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{stepTitles[currentStep - 1]}</h2>
                {renderStep()}
              </div>

              <FormNavigation 
                currentStep={currentStep}
                totalSteps={totalSteps}
                onNext={handleNextStep}
                onPrevious={handlePrevStep}
                isSubmitting={isSubmitting}
                isStepValid={isCurrentStepValid()}
              />
            </>
          )}
        </div>
      </main>
    </>
  );
};

// Componente principal que envuelve el contenido con el proveedor de contexto
export default function Formulario() {
  return (
    <FormProvider>
      <FormularioContent />
    </FormProvider>
  );
}
