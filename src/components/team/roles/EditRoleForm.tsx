'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/general/Button';
import { useForm } from 'react-hook-form';
import Select from '@/components/forms/Select';
import FormCollapsible from '@/components/general/FormCollapsible';
import { RoleData } from '@/types';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

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

// Dummy export button component
const DummyExportButton = ({ roleData }: { roleData: RoleData | null }) => {
  const [exportType, setExportType] = useState<'csv' | 'pdf'>('csv');

  const handleExport = () => {
    if (!roleData) return;
    
    const exportData = {
      ...roleData,
      exportedAt: new Date().toISOString(),
      exportType
    };
    
    console.log('Exporting role data:', exportData);
    toast.success(`Role data exported as ${exportType.toUpperCase()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <select 
        value={exportType} 
        onChange={(e) => setExportType(e.target.value as 'csv' | 'pdf')}
        className="text-sm border border-gray-300 rounded px-2 py-1"
      >
        <option value="csv">CSV</option>
        <option value="pdf">PDF</option>
      </select>
      <Button
        type="button"
        onClick={handleExport}
        disabled={!roleData}
        className="!text-xs !h-8 !px-3 bg-gray-600 hover:bg-gray-700"
      >
        Export
      </Button>
    </div>
  );
};

// Dummy permissions component
const DummyPermissionCheckboxes = ({ 
  roleId, 
  onChange 
}: { 
  roleId: number;
  onChange: (permissions: DummyPermission[]) => void;
}) => {
  const [permissions, setPermissions] = useState<DummyPermission[]>([
    {
      id: 1,
      name: 'User Management',
      description: 'Manage system users',
      moduleId: 1,
      moduleName: 'Users',
      canView: true,
      canCreate: false,
      canEdit: true,
      canExport: false
    },
    {
      id: 2,
      name: 'Role Management',
      description: 'Manage system roles',
      moduleId: 2,
      moduleName: 'Roles',
      canView: true,
      canCreate: true,
      canEdit: true,
      canExport: true
    },
    {
      id: 3,
      name: 'Loan Management',
      description: 'Manage loans and applications',
      moduleId: 3,
      moduleName: 'Loans',
      canView: true,
      canCreate: false,
      canEdit: false,
      canExport: true
    }
  ]);

  useEffect(() => {
    // Simulate loading permissions for the role
    onChange(permissions);
  }, [roleId, permissions, onChange]);

  const handlePermissionChange = (permissionId: number, field: keyof Pick<DummyPermission, 'canView' | 'canCreate' | 'canEdit' | 'canExport'>, value: boolean) => {
    const updatedPermissions = permissions.map(p => 
      p.id === permissionId ? { ...p, [field]: value } : p
    );
    setPermissions(updatedPermissions);
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

const EditRoleForm = ({
  roleData,
  closeForm,
}: {
  roleData: RoleData | null;
  closeForm?: () => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<DummyPermission[]>([]);
  const [permissionsModified, setPermissionsModified] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RoleData>();

  useEffect(() => {
    if (roleData) {
      setValue('roleName', roleData.roleName);
      setValue('roleCode', roleData.roleCode);
      setValue('status', normalizeStatus(roleData.status));
      setValue('description', roleData.description);
    }
  }, [roleData, setValue]);

  const normalizeStatus = (status: string | undefined): string => {
    if (!status) return '';
    const lowerCaseStatus = status.toLowerCase();
    return lowerCaseStatus.charAt(0).toUpperCase() + lowerCaseStatus.slice(1);
  };

  useEffect(() => {
    const subscription = watch((values) => {
      setIsModified(JSON.stringify(values) !== JSON.stringify(roleData));
    });
    return () => subscription.unsubscribe();
  }, [watch, roleData]);

  const handlePermissionsChange = (permissions: DummyPermission[]) => {
    setRolePermissions(permissions);
    setPermissionsModified(true);
  };

  const onSubmit = async (data: RoleData) => {
    try {
      setIsSubmitting(true);

      if (!roleData?.id) {
        toast.error('Role data is missing');
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedRole = {
        ...roleData,
        roleName: data.roleName,
        roleCode: data.roleCode,
        description: data.description,
        status: data.status,
        lastModified: new Date().toISOString(),
        lastModifiedBy: 'Demo User',
      };

      console.log('Updated role:', updatedRole);
      console.log('Updated permissions:', rolePermissions);

      if (permissionsModified || isModified) {
        toast.success('Role updated successfully!');
      }

      if (closeForm) {
        closeForm();
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full mb-2">
      <div className="grid grid-cols-1 gap-5">
        <div className="mt-10 mb-2">
          <div className="flex flex-wrap justify-between items-center gap-5">
            <p className="text-lg font-medium text-gray-800">Edit Role</p>
            <DummyExportButton roleData={roleData} />
          </div>
          <hr className="border-gray-50 mt-2" />
        </div>

        <div className="flex flex-col gap-y-1.5">
          <p className="text-[13px] text-gray-500">Role Title</p>
          <div className="w-full">
            <input
              type="text"
              placeholder="Role title"
              className="input-style"
              {...register('roleName', { required: true })}
            />
            {errors?.roleName && (
              <p className="text-red-400 text-[13px] mt-1">
                A title is required
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Role Code</p>
            <div className="w-full">
              <input
                type="text"
                placeholder="Role code"
                className="input-style"
                {...register('roleCode', {
                  required: true,
                })}
              />
              {errors?.roleCode && (
                <p className="text-red-400 text-[13px] mt-1">
                  A role code is required
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-y-1.5">
            <p className="text-[13px] text-gray-500">Status</p>
            <Select
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
              ]}
              selectedValue={watch('status') || ''}
              placeholder="Select status"
              onChange={(value) => {
                setValue('status', value);
                trigger('status');
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-1.5">
          <p className="text-[13px] text-gray-500">Description</p>
          <textarea
            rows={3}
            className="rounded-md border border-gray-300 w-full p-3 placeholder:text-[#9a9a9a] text-sm text-gray-700 outline-0 focus:border-2 focus:border-secondary-200/60"
            placeholder="Enter a description"
            {...register('description', { required: true })}
          />
          {errors?.description && (
            <p className="text-red-400 text-[13px]">
              A description is required
            </p>
          )}
        </div>

        <FormCollapsible
          buttonLabel="Manage Permissions"
          initialExpanded={true}
        >
          {roleData?.id ? (
            <DummyPermissionCheckboxes
              roleId={roleData.id}
              onChange={handlePermissionsChange}
            />
          ) : (
            <div className="p-4 text-gray-500">
              Save role details first to manage permissions
            </div>
          )}
        </FormCollapsible>

        <div className="flex justify-end mt-4 w-full">
          <Button
            type="submit"
            disabled={(!isModified && !permissionsModified) || isSubmitting}
            className="bg-secondary-200 flex justify-center items-center !text-sm !h-9 !w-fit !px-5"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-6 h-6 text-white" />
                <span>Updating...</span>
              </div>
            ) : (
              'Update Role'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditRoleForm;
