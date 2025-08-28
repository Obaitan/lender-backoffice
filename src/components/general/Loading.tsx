'use client';

import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-[400px] w-full flex items-center justify-center">
      <div className="flex items-center space-x-2 text-secondary-200">
        <Loader2 className="animate-spin" />
        <span className="font-semibold tracking-wide">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
