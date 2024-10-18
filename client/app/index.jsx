import { useRouter } from 'expo-router';
import { useEffect } from 'react';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    // Delay the redirect to ensure Slot has rendered
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 100);  // Slight delay to prevent navigation issues

    return () => clearTimeout(timer);
  }, []);

  return null;  // No UI, just redirect
};

export default Index;
