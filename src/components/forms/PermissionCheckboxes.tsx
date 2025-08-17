'use client';

import { useState, useEffect } from 'react';
import {
  PermissionService,
  PermissionGroup,
  RolePermission,
} from '@/services/apiQueries/permissionService';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface PermissionCheckboxesProps {
  roleId?: number;
  onChange?: (permissions: RolePermission[]) => void;
}

const PermissionCheckboxes = ({
  roleId,
  onChange,
}: PermissionCheckboxesProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(
    []
  );
  const [selectedPermissions, setSelectedPermissions] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch permissions and group them by module
  useEffect(() => {
    // Add flag to prevent setting state after unmount
    let isMounted = true;

    async function fetchPermissions() {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);

        // Get all permissions
        const permissions = await PermissionService.getPermissions();

        // Check if component is still mounted
        if (!isMounted) return;

        // Debug: Log permissions
        console.log('Fetched all available permissions:', permissions.length);

        if (!permissions || permissions.length === 0) {
          setError('No permissions available');
          setLoading(false);
          return;
        }

        // If we have a roleId, get role-specific permissions
        let rolePermissions: RolePermission[] = [];
        if (roleId) {
          try {
            rolePermissions = await PermissionService.getRolePermissions(
              roleId
            );
            if (!isMounted) return;
            console.log('Fetched role permissions:', rolePermissions.length);
          } catch (rolePermError) {
            console.error('Error fetching role permissions:', rolePermError);
            // Continue even if role permissions fail to load
          }
        }

        if (!isMounted) return;

        // Group permissions by module
        const grouped = PermissionService.groupPermissionsByModule(permissions);
        console.log('Grouped permissions by module:', grouped.length);
        setPermissionGroups(grouped);

        // Initialize selected permissions based on role permissions
        const selected: { [key: string]: boolean } = {};
        permissions.forEach((permission) => {
          // Find if this permission exists in the role's permissions
          // Each permission in rolePermissions has id field set to the permission ID
          const rolePermission = rolePermissions.find(
            (rp) => rp.id === permission.id
          );
          if (rolePermission) {
            console.log(
              `Permission ${permission.id} (${permission.name}): found in role with view=${rolePermission.canView}`
            );
          }

          // Set values for view, create, edit, export based on whether the permission exists
          selected[`${permission.id}_view`] = rolePermission
            ? rolePermission.canView
            : false;
          selected[`${permission.id}_create`] = rolePermission
            ? rolePermission.canCreate
            : false;
          selected[`${permission.id}_edit`] = rolePermission
            ? rolePermission.canEdit
            : false;
          selected[`${permission.id}_export`] = rolePermission
            ? rolePermission.canExport
            : false;
        });

        console.log(
          'Total selected permissions:',
          Object.keys(selected).length
        );

        if (!isMounted) return;
        setSelectedPermissions(selected);

        // If onChange is provided, also initialize the parent component's permissions state
        if (onChange && isMounted) {
          // Create a full permissions array with all permissions and their current state
          const fullPermissions = permissions.map((permission) => {
            const rolePermission = rolePermissions.find(
              (rp) => rp.id === permission.id
            );
            return {
              id: permission.id,
              name: permission.name,
              description: permission.description,
              moduleId: permission.moduleId,
              moduleName: permission.moduleName,
              canView: rolePermission ? rolePermission.canView : false,
              canCreate: rolePermission ? rolePermission.canCreate : false,
              canEdit: rolePermission ? rolePermission.canEdit : false,
              canExport: rolePermission ? rolePermission.canExport : false,
            };
          });

          console.log(
            'Initializing parent with permissions:',
            fullPermissions.length
          );
          console.log('Sample permission data:', fullPermissions[0]);
          // Use setTimeout to break potential circular updates
          setTimeout(() => {
            if (isMounted) {
              onChange(fullPermissions);
            }
          }, 0);
        }

        if (isMounted) {
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching permissions:', err);
        if (isMounted) {
          setError('Failed to load permissions');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPermissions();

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId]); // onChange intentionally omitted to prevent infinite loops

  // Handle checkbox changes
  const handleCheckboxChange = (
    id: number,
    type: 'view' | 'create' | 'edit' | 'export'
  ) => {
    const key = `${id}_${type}`;

    setSelectedPermissions((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      return updated;
    });
  };

  // Use a separate effect to notify parent component of changes
  useEffect(() => {
    // Skip the initial render
    if (Object.keys(selectedPermissions).length === 0) return;

    // If onChange is provided, convert to RolePermission array and call it
    if (onChange && permissionGroups.length > 0) {
      // Use a timeout to prevent excessive updates and break circular dependencies
      const timer = setTimeout(() => {
        const permissions: RolePermission[] = [];

        permissionGroups.forEach((group) => {
          group.permissions.forEach((permission) => {
            permissions.push({
              id: permission.id,
              name: permission.name,
              description: permission.description,
              moduleId: permission.moduleId,
              moduleName: permission.moduleName,
              canView: selectedPermissions[`${permission.id}_view`] || false,
              canCreate:
                selectedPermissions[`${permission.id}_create`] || false,
              canEdit: selectedPermissions[`${permission.id}_edit`] || false,
              canExport:
                selectedPermissions[`${permission.id}_export`] || false,
            });
          });
        });

        console.log(
          'Notifying parent of permission changes:',
          permissions.length
        );
        onChange(permissions);
      }, 100); // Small delay to batch changes

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPermissions, permissionGroups]); // onChange intentionally omitted to prevent circular updates

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin w-6 h-6 text-secondary-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-secondary-200 text-white rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  // If we don't have any permission groups, show a message
  if (!permissionGroups || permissionGroups.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        <p>
          No permissions available. Please try again or contact an
          administrator.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-secondary-200 text-white rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-4 mt-3">
      {permissionGroups.map((group) => (
        <div key={group.moduleName} className="mb-6">
          <p className="text-[15px] font-medium text-gray-700 mb-3">
            {group.moduleName}
          </p>

          <div className="bg-gray-50 grid grid-cols-4 gap-4 py-2">
            <div className="px-2.5 md:px-4 text-xs uppercase">View</div>
            <div className="px-2.5 md:px-4 text-xs uppercase">Create</div>
            <div className="px-2.5 md:px-4 text-xs uppercase">Edit</div>
            <div className="px-2.5 md:px-4 text-xs uppercase">Export</div>
          </div>

          {group.permissions.map((permission) => (
            <div key={permission.id} className="grid grid-cols-4 gap-4 mt-3">
              <div className="px-3.5 md:px-5">
                <Checkbox
                  checked={
                    selectedPermissions[`${permission.id}_view`] || false
                  }
                  onCheckedChange={() =>
                    handleCheckboxChange(permission.id, 'view')
                  }
                />
              </div>
              <div className="px-3.5 md:px-5">
                <Checkbox
                  checked={
                    selectedPermissions[`${permission.id}_create`] || false
                  }
                  onCheckedChange={() =>
                    handleCheckboxChange(permission.id, 'create')
                  }
                  disabled={!permission.canCreate}
                />
              </div>
              <div className="px-3.5 md:px-5">
                <Checkbox
                  checked={
                    selectedPermissions[`${permission.id}_edit`] || false
                  }
                  onCheckedChange={() =>
                    handleCheckboxChange(permission.id, 'edit')
                  }
                  disabled={!permission.canEdit}
                />
              </div>
              <div className="px-3.5 md:px-5">
                <Checkbox
                  checked={
                    selectedPermissions[`${permission.id}_export`] || false
                  }
                  onCheckedChange={() =>
                    handleCheckboxChange(permission.id, 'export')
                  }
                  disabled={!permission.canExport}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PermissionCheckboxes;
