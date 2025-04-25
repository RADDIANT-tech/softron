
import React from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import LightningBackground from '@/components/WaveBackground';
import Logo from '@/components/Logo';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LightningBackground />

      <header className="w-full text-center text-sm text-gray-500 z-10">
        <div className="max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center z-10">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Connect to Pentagon WiFi
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Fill out the form below to register for blazing-fast internet service across campus.
            </p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-6 md:p-8 border border-blue-100">
            <RegistrationForm />
          </div>
        </div>
      </main>
      
      <footer className="w-full py-4 px-6 text-center text-sm text-gray-500 z-10">
        <div className="max-w-7xl mx-auto">
        
          <p>© {new Date().getFullYear()} Pentagon WiFi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
