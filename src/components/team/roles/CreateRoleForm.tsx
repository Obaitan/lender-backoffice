'use client';

import { useState } from 'react';
import { Button } from '@/components/general/Button';
import { useForm } from 'react-hook-form';
import Select from '@/components/forms/Select';
import FormCollapsible from '@/components/general/FormCollapsible';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

// Dummy permission type for demo purposes
interface DummyPermission {
  id: number;
  name: string;
  description: string;
  moduleId: number;
  moduleName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canExport: boolean;
}

interface CreateRoleFormProps {
  onClose?: () => void;
  onRoleCreated?: () => void;
}

interface FormInputs {
  roleName: string;
  roleCode: string;
  description: string;
  status: string;
}

// Dummy permissions component
const DummyPermissionCheckboxes = ({ onChange }: { onChange: (permissions: DummyPermission[]) => void }) => {
  const [permissions] = useState<DummyPermission[]>([
    {
      id: 1,
      name: 'User Management',
      description: 'Manage system users',
      moduleId: 1,
      moduleName: 'Users',
      canView: false,
      canCreate: false,
      canEdit: false,
      canExport: false
    },
    {
      id: 2,
      name: 'Role Management',
      description: 'Manage system roles',
      moduleId: 2,
      moduleName: 'Roles',
      canView: false,
      canCreate: false,
      canEdit: false,
      canExport: false
    },
    {
      id: 3,
      name: 'Loan Management',
      description: 'Manage loans and applications',
      moduleId: 3,
      moduleName: 'Loans',
      canView: false,
      canCreate: false,
      canEdit: false,
      canExport: false
    }
  ]);

  const handlePermissionChange = (permissionId: number, field: keyof Pick<DummyPermission, 'canView' | 'canCreate' | 'canEdit' | 'canExport'>, value: boolean) => {
    const updatedPermissions = permissions.map(p => 
      p.id === permissionId ? { ...p, [field]: value } : p
    );
    onChange(updatedPermissions);
  };

  return (
    <div className="space-y-4">
      {permissions.map(permission => (
        <div key={permission.id} className="border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">{permission.name}</h4>
          <p className="text-sm text-gray-600 mb-3">{permission.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={permission.canView}
                onChange={(e) => handlePermissionChange(permission.id, 'canView', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">View</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={permission.canCreate}
                onChange={(e) => handlePermissionChange(permission.id, 'canCreate', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Create</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={permission.canEdit}
                onChange={(e) => handlePermissionChange(permission.id, 'canEdit', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Edit</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={permission.canExport}
                onChange={(e) => handlePermissionChange(permission.id, 'canExport', e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Export</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({ onClose, onRoleCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<DummyPermission[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      roleName: '',
      roleCode: '',
      description: '',
      status: 'ACTIVE',
    },
  });

  const handlePermissionsChange = (permissions: DummyPermission[]) => {
    setRolePermissions(permissions);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create dummy role object
      const newRole = {
        id: Math.floor(Math.random() * 1000) + 100,
        roleName: data.roleName,
        roleCode: data.roleCode,
        description: data.description,
        status: data.status,
        createDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        createdBy: 'Demo User',
        lastModifiedBy: 'Demo User',
      };

      console.log('Created role:', newRole);
      console.log('Assigned permissions:', rolePermissions);

      toast.success('Role created successfully!');
      reset();
      
      if (onRoleCreated) {
        onRoleCreated();
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error creating role:', err);
      toast.error('Failed to create role');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full mb-2">
      <div className="grid grid-cols-1 gap-5">
        <div className="mb-2">
          <p className="text-lg font-medium text-gray-800">New Role</p>
          <hr className="border-gray-50 mt-2" />
        </div>

        {/* Role Name */}
        <div className="flex flex-col gap-y-1.5">
          <p className="text-[13px] text-gray-500">Role Name</p>
          <input
            type="text"
            placeholder="Role name"
            className="input-style"
            {...register('roleName', { required: 'Role name is required' })}
          />
          {errors.roleName && (
            <p className="text-red-400 text-[13px] mt-1">
              {errors.roleName.message}
            </p>
          )}
        </div>

        {/* Role Code and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Role Code</p>
            <input
              type="text"
              placeholder="Role code"
              className="input-style"
              {...register('roleCode', {
                required: 'Role code is required',
                pattern: {
                  value: /^[A-Z0-9_]+$/,
                  message:
                    'Role code must contain only uppercase letters, numbers, and underscores',
                },
              })}
            />
            {errors.roleCode && (
              <p className="text-red-400 text-[13px] mt-1">
                {errors.roleCode.message}
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
        </div>

        {/* Description */}
        <div className="flex flex-col gap-y-1.5">
          <p className="text-[13px] text-gray-500">Description</p>
          <textarea
            rows={3}
            className="rounded-md border border-gray-300 w-full p-3 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-0 focus:border-2 focus:border-secondary-200/60"
            placeholder="Enter a description"
            {...register('description', {
              required: 'Description is required',
            })}
          />
          {errors.description && (
            <p className="text-red-400 text-[13px] mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Permissions */}
        <FormCollapsible buttonLabel="Assign Permissions">
          <DummyPermissionCheckboxes onChange={handlePermissionsChange} />
        </FormCollapsible>

        {/* Submit Button */}
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
              'Create Role'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateRoleForm;