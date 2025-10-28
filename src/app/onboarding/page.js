'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OnboardingPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState('');

  // Check if user has already completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (childName.trim()) {
      // Store name and onboarding completion in localStorage
      localStorage.setItem('childName', childName.trim());
      localStorage.setItem('hasCompletedOnboarding', 'true');
      
      // Navigate to chat
      router.push('/chat');
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-full  flex items-center bg-[#FBFBFB] justify-center p-8">
        <div className="text-center max-w-2xl mx-auto">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1A5845] hanken mb-4">
              Welcome onboard Ruchi & Sirish!
            </h1>
            
          </div>

          {/* Next Button */}
          <button 
            onClick={handleNext}
            className="inline-flex py-2 w-1/2 justify-center items-center bg-[#49BE9B]  text-white font-semibold text-lg rounded-md shadow-lg transition-all cursor-pointer duration-300 transform hover:scale-105 hanken"
          >
            
            Start
          </button>

          
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-full bg-[#FBFBFB] flex items-center justify-center p-8">
        <div className="  p-8 w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 hanken mb-2">
              01 What is the child's full name?
            </h2>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Type here..."
                className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C756B] focus:border-transparent transition-all duration-200 hanken bg-gray-50"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              disabled={!childName.trim()}
              className="w-full px-6 py-2 bg-[#5C756B] hover:bg-[#4a6459] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-300 hanken"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
};

export default OnboardingPage;