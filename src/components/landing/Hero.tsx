
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Bitcoin, TrendingUp } from "lucide-react";

const phrases = [
  "Track Bitcoin Live",
  "Monitor Ethereum Instantly",
  "Follow Crypto Trends",
  "Analyze Market Movements",
  "Watch Prices in Real-Time"
];

export const Hero = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(200 - Math.random() * 100);

  const tick = useCallback(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    // If deleting, remove a character, otherwise add one
    if (isDeleting) {
      setText(currentPhrase.substring(0, text.length - 1));
    } else {
      setText(currentPhrase.substring(0, text.length + 1));
    }

    // Speed up when deleting
    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 1.5);
    }

    // Switch to typing when backspace is complete
    if (isDeleting && text === '') {
      setIsDeleting(false);
      setCurrentPhraseIndex((prevIndex) => 
        (prevIndex + 1) % phrases.length
      );
      setDelta(200);
      return;
    }

    // Switch to deleting when typing is complete
    if (!isDeleting && text === currentPhrase) {
      setDelta(2000); // Wait for 2 seconds before starting to delete
      setIsDeleting(true);
    }
  }, [currentPhraseIndex, isDeleting, text]);

  useEffect(() => {
    const ticker = setTimeout(() => {
      tick();
    }, delta);

    return () => clearTimeout(ticker);
  }, [delta, tick]);

  return (
    <section className="min-h-screen relative bg-crypto-darkest bg-crypto-grid overflow-hidden flex items-center">
      {/* Gradient orb effects */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-crypto-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-crypto-blue/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <Bitcoin className="text-crypto-purple h-10 w-10 animate-pulse-soft" />
            <span className="text-lg font-bold tracking-wider text-white/90">CRYPTO VISION</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            <span className="gradient-text">{"CryptoVision: "}</span>
            <span className="typing-container inline-block">
              <span className="typing-text">{text}</span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-center text-gray-300 mb-10 max-w-2xl mx-auto">
            Get real-time cryptocurrency data, market insights, and trends — all in one powerful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={() => document.getElementById('crypto-tracker')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg" 
              className="bg-gradient-to-r from-crypto-purple to-crypto-blue hover:opacity-90 transition-all"
            >
              <TrendingUp className="mr-2 h-5 w-5" /> View Live Prices
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/10 hover:bg-white/5"
            >
              Learn More
            </Button>
          </div>

          <div className="glass-card p-6 md:p-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h3 className="text-xl md:text-2xl font-bold mb-3 gradient-text">Real-Time Cryptocurrency Tracking</h3>
                <p className="text-gray-300 mb-4">
                  Stay up to date with the latest prices, market caps, and trends for the top cryptocurrencies. Our platform refreshes automatically to ensure you have the most current data.
                </p>
                <ul className="space-y-2">
                  {['Live price updates', 'Historical performance data', 'Market cap tracking', 'Volume analysis'].map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <span className="inline-block h-2 w-2 rounded-full bg-crypto-purple mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-crypto-purple/20 to-crypto-blue/20 blur-lg rounded-full"></div>
                  <img 
                    src="https://img.icons8.com/fluency/240/cryptocurrency.png" 
                    alt="Cryptocurrency illustration" 
                    className="relative z-10 w-48 h-48 md:w-64 md:h-64 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};
