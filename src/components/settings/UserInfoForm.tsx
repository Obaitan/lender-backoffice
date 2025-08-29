'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/general/Button';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import validator from 'validator';

// Dummy user data for demo purposes
const dummyUserData = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1234567890',
  roleCode: 'USER',
  roleName: 'User',
  status: 'Active',
  profilePicture: '',
  profilePictureExtension: '',
  createDate: '2024-01-01T00:00:00Z',
  lastModified: '2024-01-01T00:00:00Z',
  createdBy: 'System',
  lastModifiedBy: 'System',
  lastLogin: '2024-01-01T00:00:00Z'
};

const UserInfoForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [userData, setUserData] = useState(dummyUserData);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  // Load dummy user data when component mounts
  useEffect(() => {
    if (userData) {
      setValue('name', `${userData.firstName} ${userData.lastName}`.trim());
      setValue('email', userData.email);
    }
  }, [setValue, userData]);

  const formValues = watch();

  const onSubmit = handleSubmit(async (data) => {
    if (!userData) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Split full name into first and last name
      const [firstName, ...lastNameParts] = data.name.split(' ');
      const lastName = lastNameParts.join(' ');

      if (!firstName || !lastName) {
        throw new Error('Please provide both first and last name');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update dummy user data
      const updatedUser = {
        ...userData,
        firstName,
        lastName,
        email: data.email,
        lastModified: new Date().toISOString(),
        lastModifiedBy: 'User'
      };
      
      // Update local state
      setUserData(updatedUser);
      setIsFormChanged(false);
      setSuccessMessage('Profile updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (error) {
      console.error('Error updating user information:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  });

  const handleFormChange = () => {
    if (!userData) return;
    
    const hasChanged =
      formValues.name !== `${userData.firstName} ${userData.lastName}`.trim() ||
      formValues.email !== userData.email;
    setIsFormChanged(hasChanged);

    // Clear messages when form changes
    setError(null);
    setSuccessMessage(null);
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin w-6 h-6 text-secondary-200" />
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      onChange={handleFormChange}
      className="w-full mb-2"
    >
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-wrap items-center gap-x-9 gap-y-1 w-full">
          <p className="w-36 text-sm md:text-base">Full Name</p>
          <div className="w-full md:w-[360px]">
            <input
              type="text"
              placeholder="Full Name"
              className={`rounded-md border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } w-full px-3 h-11 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-0 focus:border-2 focus:border-secondary-200/60`}
              {...register('name', {
                required: 'Your name is required',
                pattern: {
                  value: /^[A-Za-z]+ [A-Za-z ]+$/,
                  message: 'Please enter both first and last name',
                },
              })}
            />
            {errors?.name && (
              <p className="text-red-400 text-[13px] mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-9 gap-y-1 w-full">
          <p className="w-36 text-sm md:text-base">Email Address</p>
          <div className="w-full md:w-[360px]">
            <input
              type="email"
              placeholder="Email address"
              className={`rounded-md border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } w-full px-3 h-11 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-0 focus:border-2 focus:border-secondary-200/60`}
              {...register('email', {
                required: 'Your email is required',
                validate: (value) =>
                  validator.isEmail(value) || 'Email must be valid',
              })}
            />
            {errors?.email && (
              <p className="text-red-400 text-[13px] mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-9 gap-y-1 w-full">
          <div className="w-36"></div>
          <div className="w-full md:w-[360px]">
            {error && (
              <p className="text-red-400 text-sm mb-2" role="alert">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm mb-2" role="alert">
                {successMessage}
              </p>
            )}
            <Button
              type="submit"
              disabled={!isFormChanged || isLoading}
              className="bg-secondary-200 flex justify-center items-center !h-10 !w-full"
            >
              {isLoading ? (
                <div className="flex justify-center items-center gap-x-4">
                  <Loader2 className="animate-spin w-6 h-6 text-white" />
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Information'
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserInfoForm;