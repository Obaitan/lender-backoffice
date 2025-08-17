'use client';

import { Button } from '@/components/general/Button';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="bg-white flex justify-center items-center h-screen p-9">
      <div className="flex flex-col w-full items-center gap-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-200 mb-2.5">
            Lender
          </h1>
          <p className="text-xl text-gray-600">
            Your sure financial partner in any situation.
          </p>
        </div>

        {/* Landing Page Form */}
        <div className="w-full">
          <div className="flex flex-col items-center gap-6 w-full md:w-[400px] mx-auto">
            {/* Go to Dashboard Button */}
            <Button
              type="button"
              onClick={handleGoToDashboard}
              className="bg-secondary-200 flex justify-center items-center w-full h-12 !text-lg"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
