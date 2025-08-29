'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CustomerPicture } from '@/types';
import { getDummyCustomerPicture } from '@/utils/dummyData';

export default function CustomerProfilePicture({
  phoneNumber,
  className,
  selfie,
}: {
  phoneNumber: string;
  className?: string;
  selfie?: boolean;
}) {
  const [customerPicture, setCustomerPicture] = useState<CustomerPicture | null>(null);

  useEffect(() => {
    async function fetchPicture() {
      if (!phoneNumber) {
        return;
      }
      
      try {
        // Use dummy data instead of API call
        const pictureData = getDummyCustomerPicture(phoneNumber);
        setCustomerPicture(pictureData);
      } catch (error) {
        console.error('Error fetching customer picture:', error);
      }
    }

    fetchPicture();
  }, [phoneNumber]);

  // Handle dynamic image format using file paths
  const getImageSrc = () => {
    if (!customerPicture) return '/images/avatar.svg';
    
    try {
      // Use the file path directly from public folder
      if (customerPicture.filePath) {
        return customerPicture.filePath;
      }
      
      // Fallback to picture field if filePath is not available
      if (customerPicture.picture) {
        return customerPicture.picture;
      }
      
      return '/images/avatar.svg';
    } catch (error) {
      console.error('Error processing customer picture:', error);
      return '/images/avatar.svg';
    }
  };

  return (
    <div className="flex flex-col justify-center gap-1.5">
      <div
        className={`relative h-[72px] w-[72px] overflow-hidden flex justify-center items-center rounded-full border border-disabled ${className}`}
      >
        <Image
          src={getImageSrc()}
          alt="Profile picture"
          width={72}
          height={72}
          className="object-cover w-full h-full"
          priority={true}
          unoptimized={false}
          onError={(e) => {
            console.error('Image failed to load:', e);
            // Set fallback image on error
            e.currentTarget.src = '/images/avatar.svg';
          }}
        />
      </div>
      {selfie && (
        <p className="text-xs text-gray-400">
          Selfie
        </p>
      )}
    </div>
  );
}