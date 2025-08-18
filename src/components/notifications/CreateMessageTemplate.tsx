'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/general/Button';
import { toast } from 'react-toastify';
import { MessageTemplate } from './setupColumns';
import Select from '../forms/Select';

interface FormData {
  title: string;
  message: string;
  status: string;
}

interface CreateMessageTemplateProps {
  closeForm: () => void;
}

export default function CreateMessageTemplate({
  closeForm,
}: CreateMessageTemplateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      message: '',
      status: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMessage: MessageTemplate = {
        ...data,
        createdByName: 'Current User',
        createdByEmail: 'current.user@paylaterhub.co',
        createdAt: new Date().toISOString(),
        status: 'Active',
      };

      // TODO: Add API call to save the message template
      console.log('New message template:', newMessage);

      toast.success('Message template created successfully!');
      closeForm();
    } catch (error) {
      toast.error(
        `Failed to create message template: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-2">
      <div className="grid grid-cols-1 gap-5">
        <div className="mb-2">
          <p className="text-lg font-medium text-gray-800">
            New Message Template
          </p>
          <hr className="border-gray-50 mt-2" />
        </div>

        {/* Message Title */}
        <div className="flex flex-col gap-y-1.5">
          <p className="text-[13px] text-gray-500">Message Title</p>
          <input
            type="text"
            placeholder="Message title"
            className="rounded-md border border-gray-100 w-full px-3 h-10 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
            {...register('title', { required: 'A title is required' })}
          />
          {errors.title && (
            <p className="text-red-400 text-[13px] mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-1.5">
          <p className="text-[13px] text-gray-500">Status</p>
          <Select
            options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Inactive', value: 'INACTIVE' },
            ]}
            selectedValue={watch('status')}
            placeholder="Select status"
            onChange={(value) => setValue('status', value)}
          />
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-y-1.5">
          <p className="text-[13px] text-gray-500">Message</p>
          <textarea
            rows={7}
            className="rounded-md border border-gray-100 w-full p-3 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-2 outline-secondary-200"
            placeholder="Enter message here"
            {...register('message', { required: 'Message is required' })}
          />
          {errors.message && (
            <p className="text-red-400 text-[13px] mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4 w-full">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-secondary-200 flex justify-center items-center !text-sm !h-9 !w-fit !px-5"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </div>
            ) : (
              'Create Template'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
