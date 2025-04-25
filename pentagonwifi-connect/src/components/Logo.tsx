import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/lovable-uploads/26866c68-f024-4805-84f8-642495567891.png" 
        alt="Pentagon WiFi Logo" 
        className="mt-10 transition-transform duration-300 hover:scale-105"
        width='20%'
    
      />
    </div>
  );
};

export default Logo;
