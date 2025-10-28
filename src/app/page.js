'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    
    if (hasCompletedOnboarding === 'true') {
      // User has completed onboarding, redirect to dashboard
      router.push('/dashboard');
    } else {
      // User hasn't completed onboarding, redirect to onboarding
      router.push('/onboarding');
    }
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#5C756B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-600 hanken">Loading...</p>
      </div>
    </div>
  );
};

export default HomePage;