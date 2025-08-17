'use client';

import { useState } from 'react';
import { Button } from '@/components/general/Button';
import Select from './Select';
import { AuthService, API_CONFIG } from '@/services/authService';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface NewParameterFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

interface FormInputs {
  name: string;
  description: string;
  inputType: string;
  value: string;
  value2: string;
  unit: string;
  labelOne: string;
  labelTwo: string;
  valueOne: string;
  valueTwo: string;
  status: string;
}

const NewParameterForm: React.FC<NewParameterFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      description: '',
      inputType: '',
      value: '',
      value2: '',
      unit: '',
      labelOne: '',
      labelTwo: '',
      valueOne: '',
      valueTwo: '',
      status: '',
    },
  });

  const inputType = watch('inputType');

  const handleInputTypeChange = (value: string) => {
    setValue('inputType', value);
    // Reset values when input type changes
    setValue('value', '');
    setValue('value2', '');
    setValue('labelOne', '');
    setValue('valueOne', '');
    setValue('labelTwo', '');
    setValue('valueTwo', '');
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const currentUser = AuthService.getCurrentUser();

      let value = '';
      let value2 = '0';

      // Format values based on input type
      switch (data.inputType) {
        case 'text':
          value = data.value;
          break;
        case 'text range':
          value = data.valueOne;
          value2 = data.valueTwo;
          break;
        case 'date':
          value = data.value;
          break;
        case 'date range':
          value = data.valueOne;
          value2 = data.valueTwo;
          break;
      }

      const newParameter = {
        name: data.name,
        value: value,
        value2: value2,
        dataType:
          data.inputType === 'date' || data.inputType === 'date range'
            ? 'date'
            : 'decimal',
        createdBy: currentUser?.email || '',
        lastModifiedBy: currentUser?.email || '',
        label: data.labelOne || '',
        label2: data.labelTwo || '',
        status: '',
      };

      const headers = await AuthService.getAuthHeaders();
      headers.append('Accept', 'text/plain');
      headers.append('Content-Type', 'application/json');

      const response = await fetch(
        `${API_CONFIG.baseUrl}/api/V2/SystemParameter/createSystemParameter`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(newParameter),
          redirect: 'follow',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create parameter');
      }

      if (onSuccess) {
        onSuccess();
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating parameter:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to create parameter'
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full mb-2">
      <div className="grid grid-cols-1 gap-5">
        <div className="mb-2">
          <p className="text-lg font-medium text-gray-800">
            Add System Parameter
          </p>
          <hr className="border-gray-50 mt-2" />
        </div>

        <div className="flex flex-col gap-y-1.5">
          <p className="text-[13px] text-gray-500">Name</p>
          <div className="w-full">
            <input
              type="text"
              placeholder="Parameter name"
              className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
              {...register('name', { required: 'Parameter name is required' })}
            />
            {errors?.name && (
              <p className="text-red-400 text-[13px] mt-1">
                {errors.name.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-1.5">
          <p className="text-[13px] text-gray-500">Description</p>
          <div className="w-full">
            <textarea
              rows={3}
              className="rounded-md border border-gray-100 w-full p-3 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
              placeholder="Enter a description"
              {...register('description')}
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col gap-y-1.5">
          <p className="text-[13px] text-gray-500">Input Type</p>
          <Select
            options={[
              { label: 'Text', value: 'text' },
              { label: 'Text Range', value: 'text range' },
              { label: 'Date', value: 'date' },
              { label: 'Date Range', value: 'date range' },
            ]}
            selectedValue={inputType}
            placeholder="Select input type"
            onChange={handleInputTypeChange}
          />
        </div>

        {/* Conditional Inputs Based on Input Type */}
        {inputType === 'text' && (
          <div className="bg-secondary-50 grid grid-cols-1 md:grid-cols-2 gap-5 p-3 md:p-5 rounded">
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">Label</p>
              <input
                type="text"
                placeholder="Enter label"
                className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('labelOne')}
              />
            </div>
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">Value</p>
              <input
                type="text"
                placeholder="Enter value"
                className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('value', { required: 'Value is required' })}
              />
              {errors?.value && (
                <p className="text-red-400 text-[13px] mt-1">
                  {errors.value.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">Unit</p>
              <Select
                options={[
                  { label: 'Percentage (%)', value: '%' },
                  { label: 'NGN', value: 'ngn' },
                  { label: 'Month(s)', value: 'month(s)' },
                ]}
                selectedValue={watch('unit')}
                placeholder="Select unit"
                onChange={(value) => setValue('unit', value)}
              />
            </div>
          </div>
        )}

        {inputType === 'text range' && (
          <div className="bg-secondary-50 grid grid-cols-1 md:grid-cols-2 gap-5 p-3 md:p-5 rounded">
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">First Label</p>
              <input
                type="text"
                placeholder="Enter first label"
                className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('labelOne')}
              />
            </div>
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">Value One</p>
              <input
                type="text"
                placeholder="Enter first value"
                className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('valueOne', {
                  required: 'First value is required',
                })}
              />
              {errors?.valueOne && (
                <p className="text-red-400 text-[13px] mt-1">
                  {errors.valueOne.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">Second Label</p>
              <input
                type="text"
                placeholder="Enter second label"
                className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('labelTwo')}
              />
            </div>
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">Value Two</p>
              <input
                type="text"
                placeholder="Enter second value"
                className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('valueTwo', {
                  required: 'Second value is required',
                })}
              />
              {errors?.valueTwo && (
                <p className="text-red-400 text-[13px] mt-1">
                  {errors.valueTwo.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">Unit</p>
              <Select
                options={[
                  { label: 'Percentage (%)', value: '%' },
                  { label: 'NGN', value: 'NGN' },
                  { label: 'Month(s)', value: 'month(s)' },
                ]}
                selectedValue={watch('unit')}
                placeholder="Select unit"
                onChange={(value) => setValue('unit', value)}
              />
            </div>
          </div>
        )}

        {inputType === 'date' && (
          <div className="bg-secondary-50 grid grid-cols-1 md:grid-cols-2 gap-5 p-3 md:p-5 rounded">
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">Date</p>
              <input
                type="date"
                className="rounded-md border border-gray-100 w-full px-3 h-10 text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('value', { required: 'Date is required' })}
              />
              {errors?.value && (
                <p className="text-red-400 text-[13px] mt-1">
                  {errors.value.message}
                </p>
              )}
            </div>
          </div>
        )}

        {inputType === 'date range' && (
          <div className="bg-secondary-50 grid grid-cols-1 md:grid-cols-2 gap-5 p-3 md:p-5 rounded">
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">Start Date</p>
              <input
                type="date"
                className="rounded-md border border-gray-100 w-full px-3 h-10 text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('valueOne', {
                  required: 'Start date is required',
                })}
              />
              {errors?.valueOne && (
                <p className="text-red-400 text-[13px] mt-1">
                  {errors.valueOne.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-y-1.5">
              <p className="text-[13px] text-gray-500">End Date</p>
              <input
                type="date"
                className="rounded-md border border-gray-100 w-full px-3 h-10 text-sm text-gray-700 outline-2 outline-secondary-200"
                {...register('valueTwo', { required: 'End date is required' })}
              />
              {errors?.valueTwo && (
                <p className="text-red-400 text-[13px] mt-1">
                  {errors.valueTwo.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4 w-full">
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <div className="flex gap-4">
            {onClose && (
              <Button
                type="button"
                onClick={onClose}
                className="border border-secondary-200 !text-secondary-200 flex justify-center items-center !h-10 !w-32"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-secondary-200 flex justify-center items-center !h-10 !w-44"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-6 h-6 text-white" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Save Parameter'
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NewParameterForm;
