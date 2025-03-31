import React from 'react';

export interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting?: boolean;
  isStepValid?: boolean;
}

const FormNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isSubmitting = false,
  isStepValid = true,
}: FormNavigationProps) => {
  return (
    <div className="flex justify-between mt-6 sm:mt-8 px-1 sm:px-0">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:py-2.5 px-3 sm:px-4 text-sm sm:text-base rounded-l flex-1 sm:flex-initial mr-2 sm:mr-0"
        >
          Atrás
        </button>
      ) : (
        <div className="flex-1 sm:flex-initial mr-2 sm:mr-0"></div>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting || !isStepValid}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4 text-sm sm:text-base rounded-r flex-1 sm:flex-initial ${(isSubmitting || !isStepValid) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Procesando...' : currentStep === totalSteps ? 'Enviar' : 'Continuar'}
      </button>
    </div>
  );
};

export default FormNavigation;
