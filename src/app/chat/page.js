'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompletedOnboarding !== 'true') {
      router.push('/onboarding');
      return;
    }
    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-1.6rem)] bg-white overflow-hidden">
      <ChatInterface />
    </div>
  );
}