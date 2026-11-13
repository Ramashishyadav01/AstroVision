import React from 'react';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading cosmic data...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Cosmic spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-400 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-blue-400 animate-spin" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">⭐</div>
      </div>
      <div className="text-center">
        <p className="text-yellow-400 font-medium text-lg">{message}</p>
        <p className="text-white/40 text-sm mt-1">Please wait...</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="cosmic-bg flex items-center justify-center min-h-screen">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {content}
    </div>
  );
};

export default LoadingSpinner;
