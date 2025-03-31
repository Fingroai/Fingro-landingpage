import React from 'react';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

const FormProgress = ({ currentStep, totalSteps, stepTitles }: FormProgressProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => ({
    id: i + 1,
    name: stepTitles[i]
  }));

  return (
    <div className="py-3 sm:py-4">
      {/* En móviles, mostrar solo los números de paso en círculos pequeños */}
      <div className="flex justify-between mb-2 px-1">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
              currentStep === step.id 
                ? 'bg-primary-600 text-white' 
                : currentStep > step.id 
                  ? 'bg-primary-200 text-primary-800' 
                  : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step.id}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 h-1.5 sm:h-2 mb-3 sm:mb-4 rounded-full">
        <div 
          className="bg-primary-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
      <div className="text-center text-xs sm:text-sm font-medium text-primary-700 truncate px-2">
        Paso {currentStep}: {steps.find(step => step.id === currentStep)?.name}
      </div>
    </div>
  );
};

export default FormProgress;
