"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Cpu, FileSearch, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoadingEvaluation() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: FileSearch, text: "Analyzing resume content..." },
    { icon: Brain, text: "Evaluating skills and experience..." },
    { icon: Cpu, text: "Generating AI recommendations..." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        // Update the current step based on progress
        if (oldProgress >= 66) {
          setCurrentStep(2);
        } else if (oldProgress >= 33) {
          setCurrentStep(1);
        }
        
        const newProgress = oldProgress + 1;
        return newProgress;
      });
    }, 150);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 sm:py-12">

    <Card className="p-6 sm:p-8 md:p-10 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Processing Your Application</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Our AI is analyzing your profile and generating personalized feedback
        </p>
      </div>

      <div className="space-y-8">
        <div className="relative">
          <Progress value={progress} className="h-2 sm:h-3" />
          <div className="absolute right-0 top-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            {progress}%
          </div>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep >= index;
            const isCompleted = currentStep > index;
            
            return (
              <div 
                key={index} 
                className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/5 dark:bg-primary/10' 
                    : 'opacity-50'
                }`}
              >
                <div className={`relative rounded-full p-2 ${
                  isActive 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground' 
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                }`}>
                  <StepIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  {isActive && !isCompleted && (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm sm:text-base font-medium ${
                    isActive ? 'text-foreground' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.text}
                  </p>
                </div>
                {isCompleted && (
                  <div className="text-green-500 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center items-center pt-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-3 text-sm sm:text-base font-medium">
            Please wait while we process your application...
          </span>
        </div>
      </div>
    </Card>
    </div>
  </div>
  );
}