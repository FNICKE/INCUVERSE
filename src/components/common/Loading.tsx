import React from 'react';
import { Shield } from 'lucide-react';

export const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-4">
          <Shield className="h-12 w-12 text-purple-400 mx-auto animate-pulse" />
          <div className="absolute inset-0 h-12 w-12 mx-auto border-2 border-purple-400 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="text-white text-lg font-medium">Loading...</p>
        <p className="text-purple-200 text-sm">Please wait while we load your content</p>
      </div>
    </div>
  );
};