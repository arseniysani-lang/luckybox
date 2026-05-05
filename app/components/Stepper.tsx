'use client';
import React, { useState, Children, ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepperProps {
  children: ReactElement[];
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
}

export const Step: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="step-content">{children}</div>;
};

const Stepper: React.FC<StepperProps> = ({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = "Назад",
  nextButtonText = "Далее"
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const steps = Children.toArray(children);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
      onStepChange?.(currentStep + 1);
    } else if (onFinalStepCompleted) {
      onFinalStepCompleted();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      onStepChange?.(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((_, index) => (
            <React.Fragment key={index}>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full 
                ${index + 1 <= currentStep ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600'}`}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 
                  ${index + 1 < currentStep ? 'bg-yellow-400' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[200px]"
        >
          {steps[currentStep - 1]}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded-lg ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {backButtonText}
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
        >
          {currentStep === steps.length ? 'Завершить' : nextButtonText}
        </button>
      </div>
    </div>
  );
};

export default Stepper; 