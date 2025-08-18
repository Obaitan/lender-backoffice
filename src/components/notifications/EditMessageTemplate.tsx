'use client';

import { useState, useEffect } from 'react';
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

interface EditMessageTemplateProps {
  closeForm: () => void;
  template: MessageTemplate;
}

export default function EditMessageTemplate({
  closeForm,
  template,
}: EditMessageTemplateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: template.title,
      message: template.message,
      status: template.status,
    },
  });

  // Watch all form fields for changes
  const formValues = watch();

  // Check if any field has changed from its original value
  useEffect(() => {
    const hasFormChanges =
      formValues.title !== template.title ||
      formValues.message !== template.message ||
      formValues.status !== template.status;

    setHasChanges(hasFormChanges);
  }, [formValues, template]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedMessage: MessageTemplate = {
        ...template,
        ...data,
        status: data.status,
      };

      // TODO: Add API call to update the message template
      console.log('Updated message template:', updatedMessage);

      toast.success('Message template updated successfully!');
      closeForm();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update message template. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-2">
      <div className="grid grid-cols-1 gap-5">
        <div className="mb-2">
          <p className="text-lg font-medium text-gray-800">
            Edit Message Template
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
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
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
            disabled={isSubmitting || !hasChanges}
            className="bg-secondary-200 flex justify-center items-center !text-sm !h-9 !w-fit !px-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </div>
            ) : (
              'Update Template'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
