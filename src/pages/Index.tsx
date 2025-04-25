
import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { CryptoTracker } from '@/components/crypto/CryptoTracker';
import { Footer } from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-crypto-darkest text-white">
      <Hero />
      <CryptoTracker />
      <Footer />
    </div>
  );
};

export default Index;
