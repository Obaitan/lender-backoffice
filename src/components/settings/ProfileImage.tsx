'use client';

import Image from 'next/image';

const ProfileImage = () => {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="relative h-20 w-20 overflow-hidden flex justify-center items-center rounded-full border border-primary-200">
        <Image
          src="/docs/hju.png"
          alt="Profile image"
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="font-medium text-gray-700">
        <p>Profile Image</p>
      </div>
    </div>
  );
};

export default ProfileImage;
