import { useState } from 'react';
import { Button } from '@/components/general/Button';
import { useForm } from 'react-hook-form';
import validator from 'validator';
import Select from '../../forms/Select';
import FormCollapsible from '../../general/FormCollapsible';
import { TeamMember } from '@/types';
import { toast } from 'react-toastify';

interface EditUserFormProps {
  userData: TeamMember | null;
  closeForm?: () => void;
  onUserUpdated?: () => void;
}

interface FormInputs {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  roleName: string;
  status: string;
  supervisor: string;
  rmCode: string;
  transferFromPerson: string;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ userData, closeForm, onUserUpdated }) => {
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
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
      phoneNo: userData?.phoneNumber || '',
      roleName: userData?.roleCode || '',
      status: userData?.status || '',
      supervisor: userData?.superiorOfficer || '',
      rmCode: userData?.rmCode || '',
      transferFromPerson: ''
    }
  });

  const normalizeStatus = (status: string | undefined): string => {
    if (!status) return '';
    const lowerCaseStatus = status.toLowerCase();
    return lowerCaseStatus.charAt(0).toUpperCase() + lowerCaseStatus.slice(1);
  };

  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('User updated successfully (Demo Mode)');
      setIsSubmitting(false);
      
      if (onUserUpdated) {
        onUserUpdated();
      }
      
      if (closeForm) {
        closeForm();
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-2">
      <div className="grid grid-cols-1 gap-5">
        <div className="mb-2">
          <p className="text-lg font-medium text-gray-800">Edit User</p>
          <hr className="border-gray-50 mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          {/* First Name Field */}
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">First Name</p>
            <input
              type="text"
              placeholder="First Name"
              className="input-style"
              {...register('firstName', { required: true })}
            />
            {errors?.firstName && (
              <p className="text-red-400 text-[13px] mt-1">
                First name is required
              </p>
            )}
          </div>

          {/* Last Name Field */}
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Last Name</p>
            <input
              type="text"
              placeholder="Last Name"
              className="input-style"
              {...register('lastName', { required: true })}
            />
            {errors?.lastName && (
              <p className="text-red-400 text-[13px] mt-1">
                Last name is required
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          {/* Email Field */}
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Email Address</p>
            <input
              type="email"
              placeholder="Email address"
              className="input-style"
              {...register('email', {
                required: true,
                validate: (value) =>
                  validator.isEmail(value) || 'Invalid email format',
              })}
            />
            {errors?.email && (
              <p className="text-red-400 text-[13px] mt-1">
                {errors.email.message || 'Valid email is required'}
              </p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Phone Number</p>
            <input
              type="text"
              placeholder="0804 045 9875"
              className="input-style"
              {...register('phoneNo', { required: true })}
            />
            {errors?.phoneNo && (
              <p className="text-red-400 text-[13px] mt-1">
                Phone number is required
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          {/* Role Selection */}
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Role</p>
            <Select
              options={roles}
              selectedValue={watch('roleName') || ''}
              placeholder="Select role"
              onChange={(value) => setValue('roleName', value)}
            />
          </div>

          {/* Status Selection */}
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Status</p>
            <Select
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
              selectedValue={watch('status') || ''}
              placeholder="Select status"
              onChange={(value) => setValue('status', value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">RM Code / Work ID</p>
            <div className="bg-[#f9f9f9] rounded-md border border-gray-100 px-3 h-10 text-sm text-gray-700 flex items-center">
              {userData?.rmCode || 'RM 2345'}
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
                selectedValue=""
                placeholder="Choose officer"
                onChange={(value) => setValue('transferFromPerson', value)}
              />
            </div>
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">To</p>
              <div className="bg-[#f9f9f9] rounded-md border border-gray-100 px-3 h-10 text-sm text-gray-700 flex items-center">
                {userData?.rmCode || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <FormCollapsible buttonLabel="Permissions">
          <div className="p-4 text-gray-500 text-center">
            Permissions management is disabled in demo mode
          </div>
        </FormCollapsible>

        <div className="flex justify-end gap-4 mt-4 w-full">
          {closeForm && (
            <Button
              type="button"
              onClick={closeForm}
              className="border border-secondary-200 !text-secondary-200 flex justify-center items-center !text-sm !h-9 !w-fit !px-5"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-secondary-200 flex justify-center items-center !text-sm !h-9 !w-fit !px-5"
          >
            {isSubmitting ? 'Updating...' : 'Update User'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditUserForm;