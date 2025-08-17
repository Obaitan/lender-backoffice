'use client';

import { useState } from 'react';
import { Button } from '@/components/general/Button';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Select from '../forms/Select';
import { AuthService, API_CONFIG } from '@/services/authService';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface AddCustomerFormProps {
  onClose?: () => void;
  onCustomerCreated?: () => void;
}

interface CustomerFormInputs {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  status: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  landMark: string;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onCustomerCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CustomerFormInputs>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      gender: '',
      dateOfBirth: '',
      maritalStatus: '',
      status: 'Active',
      address: '',
      city: '',
      state: '',
      country: 'Nigeria',
      postalCode: '',
      landMark: '',
    },
  });

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const maritalStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' },
  ];

  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  const nigerianStates = [
    { label: 'Abia', value: 'Abia' },
    { label: 'Adamawa', value: 'Adamawa' },
    { label: 'Akwa Ibom', value: 'Akwa Ibom' },
    { label: 'Anambra', value: 'Anambra' },
    { label: 'Bauchi', value: 'Bauchi' },
    { label: 'Bayelsa', value: 'Bayelsa' },
    { label: 'Benue', value: 'Benue' },
    { label: 'Borno', value: 'Borno' },
    { label: 'Cross River', value: 'Cross River' },
    { label: 'Delta', value: 'Delta' },
    { label: 'Ebonyi', value: 'Ebonyi' },
    { label: 'Edo', value: 'Edo' },
    { label: 'Ekiti', value: 'Ekiti' },
    { label: 'Enugu', value: 'Enugu' },
    { label: 'Gombe', value: 'Gombe' },
    { label: 'Imo', value: 'Imo' },
    { label: 'Jigawa', value: 'Jigawa' },
    { label: 'Kaduna', value: 'Kaduna' },
    { label: 'Kano', value: 'Kano' },
    { label: 'Katsina', value: 'Katsina' },
    { label: 'Kebbi', value: 'Kebbi' },
    { label: 'Kogi', value: 'Kogi' },
    { label: 'Kwara', value: 'Kwara' },
    { label: 'Lagos', value: 'Lagos' },
    { label: 'Nasarawa', value: 'Nasarawa' },
    { label: 'Niger', value: 'Niger' },
    { label: 'Ogun', value: 'Ogun' },
    { label: 'Ondo', value: 'Ondo' },
    { label: 'Osun', value: 'Osun' },
    { label: 'Oyo', value: 'Oyo' },
    { label: 'Plateau', value: 'Plateau' },
    { label: 'Rivers', value: 'Rivers' },
    { label: 'Sokoto', value: 'Sokoto' },
    { label: 'Taraba', value: 'Taraba' },
    { label: 'Yobe', value: 'Yobe' },
    { label: 'Zamfara', value: 'Zamfara' },
    { label: 'FCT', value: 'FCT' },
  ];

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!data.gender) {
        toast.error('Gender is required');
        return;
      }
      
      if (!data.maritalStatus) {
        toast.error('Marital status is required');
        return;
      }
      
      const currentUser = AuthService.getCurrentUser();
      
      // Format the date of birth to ISO format
      const formattedDateOfBirth = new Date(data.dateOfBirth).toISOString();
      
      const newCustomer = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        gender: data.gender,
        dateOfBirth: formattedDateOfBirth,
        maritalStatus: data.maritalStatus,
        createdBy: currentUser?.email || '',
        lastModifiedBy: currentUser?.email || '',
        status: data.status,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: data.postalCode,
        landMark: data.landMark,
      };

      console.log('Creating customer with data:', newCustomer);

      const headers = await AuthService.getAuthHeaders();
      headers.append('Accept', 'text/plain');
      headers.append('Content-Type', 'application/json');

      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/Customer/createCustomer`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(newCustomer),
          redirect: 'follow',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error creating customer:', errorText);
        toast.error('Failed to create customer');
        throw new Error(errorText || 'Failed to create customer');
      }

      const createdCustomer = await response.json();
      console.log('Customer created successfully:', createdCustomer);

      toast.success('Customer created successfully');
      reset();
      
      // Refresh the customers list
      if (onCustomerCreated) {
        onCustomerCreated();
      }
    } catch (err) {
      console.error('Error creating customer:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create customer');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full mb-2">
      <div className="grid grid-cols-1 gap-5">
        <div className="mb-2">
          <p className="text-lg font-medium text-gray-800">New Customer</p>
          <hr className="border-gray-50 mt-2" />
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">First Name *</p>
            <div className="w-full">
              <input
                type="text"
                placeholder="First Name"
                className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('firstName', {
                  required: 'First name is required',
                })}
              />
              {errors?.firstName && (
                <p className="text-red-400 text-[13px] mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Last Name *</p>
            <div className="w-full">
              <input
                type="text"
                placeholder="Last Name"
                className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('lastName', {
                  required: 'Last name is required',
                })}
              />
              {errors?.lastName && (
                <p className="text-red-400 text-[13px] mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Phone Number *</p>
            <div className="w-full">
              <input
                type="tel"
                placeholder="2348012345678"
                className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
              />
              {errors?.phoneNumber && (
                <p className="text-red-400 text-[13px] mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Email Address *</p>
            <div className="w-full">
              <input
                type="email"
                placeholder="customer@example.com"
                className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('email', {
                  required: 'Email is required',
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Gender *</p>
            <Select
              options={genderOptions}
              selectedValue={watch('gender')}
              placeholder="Select gender"
              onChange={(value) => setValue('gender', value)}
            />
            {errors?.gender && (
              <p className="text-red-400 text-[13px] mt-1">
                Gender is required
              </p>
            )}
          </div>

          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Date of Birth *</p>
            <div className="w-full">
              <input
                type="date"
                className="rounded-md border border-gray-100 w-full px-3 h-10 text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('dateOfBirth', {
                  required: 'Date of birth is required',
                })}
              />
              {errors?.dateOfBirth && (
                <p className="text-red-400 text-[13px] mt-1">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Marital Status *</p>
            <Select
              options={maritalStatusOptions}
              selectedValue={watch('maritalStatus')}
              placeholder="Select marital status"
              onChange={(value) => setValue('maritalStatus', value)}
            />
            {errors?.maritalStatus && (
              <p className="text-red-400 text-[13px] mt-1">
                Marital status is required
              </p>
            )}
          </div>

          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Status</p>
            <Select
              options={statusOptions}
              selectedValue={watch('status')}
              placeholder="Select status"
              onChange={(value) => setValue('status', value)}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="my-4">
          <p className="text-gray-800 font-medium mb-3">Address Information</p>
          
          <div className="grid grid-cols-1 gap-y-4">
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">Address</p>
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Street address"
                  className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                  {...register('address')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col gap-y-1.5">
                <p className="text-[13px] text-gray-500">City</p>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="City"
                    className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                    {...register('city')}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-y-1.5">
                <p className="text-[13px] text-gray-500">State</p>
                <Select
                  options={nigerianStates}
                  selectedValue={watch('state')}
                  placeholder="Select state"
                  onChange={(value) => setValue('state', value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col gap-y-1.5">
                <p className="text-[13px] text-gray-500">Country</p>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Country"
                    className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                    {...register('country')}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-y-1.5">
                <p className="text-[13px] text-gray-500">Postal Code</p>
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Postal code"
                    className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                    {...register('postalCode')}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">Landmark</p>
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Nearest landmark"
                  className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                  {...register('landMark')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 w-full">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-secondary-200 flex justify-center items-center !text-sm !h-9 !w-fit !px-5"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-6 h-6 text-white" />
                <span>Creating...</span>
              </div>
            ) : (
              'Create Customer'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddCustomerForm;