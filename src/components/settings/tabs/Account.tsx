'use client';

import SelfieCapture from '../ProfileImage';
import UserInfoForm from '../UserInfoForm';

export const Account = () => {
  return (
    <>
      <SelfieCapture />
      <hr className="border border-gray-100 mt-6 mb-8" />
      <UserInfoForm />
    </>
  );
};
