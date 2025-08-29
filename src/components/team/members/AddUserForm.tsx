'use client';

import { useState } from 'react';
import { Button } from '@/components/general/Button';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Select from '../../forms/Select';
import FormCollapsible from '../../general/FormCollapsible';
import { toast } from 'react-toastify';

interface AddUserFormProps {
  onClose?: () => void;
  onUserCreated?: () => void;
}

interface FormInputs {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  roleName: string;
  status: string;
  supervisor: string;
  transferFromPerson: string;
  rmCode: string;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onUserCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static dummy data for dropdowns
  const roles = [
    { value: 'ADM', label: 'Administrator' },
    { value: 'MGR', label: 'Manager' },
    { value: 'SUP', label: 'Supervisor' },
    { value: 'AGT', label: 'Agent' },
    { value: 'CRO', label: 'Credit Officer' },
    { value: 'CAM', label: 'Credit Analyst Manager' }
  ];

  const supervisors = [
    { value: 'RM001', label: 'John Adebayo (MGR)' },
    { value: 'RM002', label: 'Sarah Okafor (AGT)' },
    { value: 'RM003', label: 'Michael Eze (SUP)' },
    { value: 'RM004', label: 'Grace Nwosu (AGT)' },
    { value: 'RM005', label: 'David Okoro (ADM)' }
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      roleName: '',
      status: '',
      supervisor: '',
      transferFromPerson: '',
      rmCode: '',
    },
  });

  const onSubmit = handleSubmit(async () => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('User created successfully (Demo Mode)');
      setIsSubmitting(false);
      
      reset();
      
      // Refresh the team members list
      if (onUserCreated) {
        onUserCreated();
      }
    }, 1000);
  });

  return (
    <form onSubmit={onSubmit} className="w-full mb-2">
      <div className="grid grid-cols-1 gap-5">
        <div className="mb-2">
          <p className="text-lg font-medium text-gray-800">New Team Member</p>
          <hr className="border-gray-50 mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">First Name</p>
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
            <p className="text-[13px] text-gray-500">Last Name</p>
            <div className="w-full">
              <input
                type="text"
                placeholder="Last Name"
                className="input-style"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Email Address</p>
            <div className="w-full">
              <input
                type="email"
                placeholder="Email address"
                className="input-style"
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

          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Phone Number</p>
            <div className="w-full">
              <input
                type="text"
                placeholder="0804 045 9875"
                className="input-style"
                {...register('phoneNo', {
                  required: 'Phone number is required',
                })}
              />
              {errors?.phoneNo && (
                <p className="text-red-400 text-[13px] mt-1">
                  {errors.phoneNo.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Role</p>
            <Select
              options={roles}
              selectedValue={watch('roleName')}
              placeholder="Choose role"
              onChange={(value) => setValue('roleName', value)}
            />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Status</p>
            <Select
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
              selectedValue={watch('status')}
              placeholder="Choose status"
              onChange={(value) => setValue('status', value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">RM Code</p>
            <div className="w-full">
              <input
                type="text"
                placeholder="RM Code (optional)"
                className="input-style"
                {...register('rmCode')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Supervisor</p>
            <Select
              options={supervisors}
              selectedValue={watch('supervisor')}
              placeholder="Choose supervisor"
              onChange={(value) => setValue('supervisor', value)}
            />
          </div>
        </div>

        <div className="my-4">
          <p className="text-gray-800 font-medium mb-3">
            Transfer Responsibility
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">From</p>
              <Select
                options={supervisors}
                selectedValue={watch('transferFromPerson')}
                placeholder="Choose officer"
                onChange={(value) => setValue('transferFromPerson', value)}
              />
            </div>
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">To</p>
              <div className="bg-[#f9f9f9] rounded-md border border-gray-100 px-3 h-10 text-sm text-gray-500 flex items-center">
                {watch('rmCode') || 'Enter RM Code above'}
              </div>
            </div>
          </div>
        </div>

        <FormCollapsible
          buttonLabel="Manage Permissions"
          initialExpanded={true}
        >
          <div className="p-4 text-gray-500 text-center">
            Permissions management is disabled in demo mode
          </div>
        </FormCollapsible>

        <div className="flex justify-end mt-4 w-full">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-secondary-200 flex justify-center items-center !text-sm !h-9 !w-fit !px-5"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddUserForm;
