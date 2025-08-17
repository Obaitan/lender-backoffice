'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export const BackButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="bg-transparent flex items-center gap-0.5 text-sm font-medium py-1.5 px-2.5 rounded-md text-secondary-200 hover:bg-[#f9f9f9] hover:font-semibold"
    >
      <ArrowLeftIcon className="h-[18px] w-[18px] mr-1" /> Back
    </button>
  );
};
