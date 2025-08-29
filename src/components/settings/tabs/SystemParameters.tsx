'use client';

import { useState, useEffect } from 'react';
import { useScreenSize } from '@/hooks/useScreenSize';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/forms/Switch';
import { PencilSquareIcon, SquaresPlusIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/general/Button';
import SideModal from '@/components/layout/SideModal';
import NewParameterForm from '@/components/forms/NewParameterForm';
import { formatNumber } from '@/utils/functions';
import LoanTenorCheckboxes from './LoanTenorCheckboxes';

interface SystemParameter {
  id: number;
  name: string;
  value: string;
  value2: string;
  dataType: string;
  createDate: string;
  lastModified: string;
  createdBy: string;
  lastModifiedBy: string;
  label: string;
  label2: string;
  status: string;
}

const MOBILE_BREAKPOINT = 768; // px

// Dummy system parameters data
const DUMMY_PARAMETERS: SystemParameter[] = [
  {
    id: 1,
    name: 'Interest Rate',
    value: '15.5',
    value2: '18.0',
    dataType: 'decimal',
    createDate: '2023-01-01T00:00:00Z',
    lastModified: '2023-12-01T00:00:00Z',
    createdBy: 'admin@example.com',
    lastModifiedBy: 'admin@example.com',
    label: 'Minimum Rate (%)',
    label2: 'Maximum Rate (%)',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Loan Amount',
    value: '50000',
    value2: '5000000',
    dataType: 'decimal',
    createDate: '2023-01-01T00:00:00Z',
    lastModified: '2023-12-01T00:00:00Z',
    createdBy: 'admin@example.com',
    lastModifiedBy: 'admin@example.com',
    label: 'Minimum Amount (₦)',
    label2: 'Maximum Amount (₦)',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Processing Fee',
    value: '2.5',
    value2: '0',
    dataType: 'decimal',
    createDate: '2023-01-01T00:00:00Z',
    lastModified: '2023-12-01T00:00:00Z',
    createdBy: 'admin@example.com',
    lastModifiedBy: 'admin@example.com',
    label: 'Fee Percentage (%)',
    label2: '',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Late Payment Fee',
    value: '1000',
    value2: '0',
    dataType: 'decimal',
    createDate: '2023-01-01T00:00:00Z',
    lastModified: '2023-12-01T00:00:00Z',
    createdBy: 'admin@example.com',
    lastModifiedBy: 'admin@example.com',
    label: 'Fixed Fee (₦)',
    label2: '',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Loan Tenor (Months)',
    value: '3,6,9,12',
    value2: '0',
    dataType: 'text',
    createDate: '2023-01-01T00:00:00Z',
    lastModified: '2023-12-01T00:00:00Z',
    createdBy: 'admin@example.com',
    lastModifiedBy: 'admin@example.com',
    label: 'Active Loan Tenors',
    label2: '',
    status: 'Active',
  },
];

const SystemParameters = () => {
  const { width } = useScreenSize();
  const isMobile = width > 0 && width < MOBILE_BREAKPOINT;
  const [activeTab, setActiveTab] = useState(0);
  const [openTab, setOpenTab] = useState<number | null>(null);
  const [parameters, setParameters] = useState<SystemParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editableSections, setEditableSections] = useState<boolean[]>([]);
  const [editedValues, setEditedValues] = useState<
    Record<
      number,
      {
        value: string;
        value2: string;
        label: string;
        label2: string;
        status?: string;
      }
    >
  >({});
  const [openModal, setOpenModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchParameters = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use dummy data instead of API call
      setParameters(DUMMY_PARAMETERS);
      setEditableSections(new Array(DUMMY_PARAMETERS.length).fill(false));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load system parameters'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  // Toggle for mobile collapsible
  const handleToggle = (idx: number) => {
    setOpenTab((prev) => (prev === idx ? null : idx));
  };

  const toggleEditSection = (index: number) => {
    setEditableSections((prevState) =>
      prevState.map((isEditable, i) => {
        if (i === index) {
          // Clear edited values when disabling edit mode
          if (isEditable) {
            const parameter = parameters[index];
            setEditedValues((prev) => {
              const newValues = { ...prev };
              delete newValues[parameter.id];
              return newValues;
            });
          }
          return !isEditable;
        }
        return isEditable;
      })
    );
  };

  const handleParameterUpdate = async () => {
    try {
      setIsUpdating(true);
      setError(null);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update parameters with edited values (dummy update)
      setParameters((prevParams) =>
        prevParams.map((param) => {
          const editedValue = editedValues[param.id];
          if (editedValue) {
            return {
              ...param,
              value: editedValue.value,
              value2: editedValue.value2,
              status: editedValue.status ?? param.status,
              lastModified: new Date().toISOString(),
              lastModifiedBy: 'admin@example.com',
            };
          }
          return param;
        })
      );

      setEditedValues({});
      setEditableSections(new Array(parameters.length).fill(false));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update parameters'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const openSideModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);

  const renderParameterContent = (
    parameter: SystemParameter,
    index: number
  ) => {
    // Helper to determine if value should be formatted
    const shouldFormat = (val: string) => {
      const num = parseFloat(val);
      return !isNaN(num) && Math.abs(num) > 999;
    };
    // Helper to strip formatting (remove commas)
    const stripFormatting = (val: string) => val.replace(/,/g, '');

    const valueRaw = editedValues[parameter.id]?.value ?? parameter.value;
    const value2Raw = editedValues[parameter.id]?.value2 ?? parameter.value2;
    const isEditing = editableSections[index];

    // Special handling for Loan Tenor parameter
    if (
      parameter.name === 'Loan Tenure' ||
      parameter.name === 'Loan Tenor (Months)'
    ) {
      const selectedTenors = valueRaw
        ? valueRaw
            .split(',')
            .map((t) => parseInt(t.trim()))
            .filter((t) => !isNaN(t))
        : [];

      return (
        <div className="grid grid-cols-1 gap-y-5 items-start">
          <div className="flex flex-wrap justify-between items-center gap-2.5 w-full">
            <p className="text-sm md:text-base text-primary-200">
              System parameter for Loan Tenure (Months)
            </p>
            <div className="flex items-center gap-3">
              <Switch
                isChecked={
                  editedValues[parameter.id]?.status
                    ? editedValues[parameter.id]?.status === 'Active'
                    : parameter.status === 'Active'
                }
                onChange={(checked) => {
                  setParameters((prev) =>
                    prev.map((p) =>
                      p.id === parameter.id
                        ? { ...p, status: checked ? 'Active' : 'Inactive' }
                        : p
                    )
                  );
                  setEditedValues((prev) => ({
                    ...prev,
                    [parameter.id]: {
                      ...(prev[parameter.id] || {
                        value: parameter.value,
                        value2: parameter.value2,
                        label: parameter.label,
                        label2: parameter.label2,
                      }),
                      status: checked ? 'Active' : 'Inactive',
                    },
                  }));
                }}
              />
              <PencilSquareIcon
                className="h-6 w-6 text-gray-200 hover:text-secondary-200 cursor-pointer"
                onClick={() => toggleEditSection(index)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-3">
            <p className="text-sm font-medium text-gray-500">
              Select active Loan Tenures(in months)
            </p>
            <LoanTenorCheckboxes
              selectedTenors={selectedTenors}
              onTenorChange={(tenors) => {
                const tenorString = tenors.join(',');
                setEditedValues((prev) => ({
                  ...prev,
                  [parameter.id]: {
                    value: tenorString,
                    value2: prev[parameter.id]?.value2 ?? parameter.value2,
                    label: prev[parameter.id]?.label ?? parameter.label,
                    label2: prev[parameter.id]?.label2 ?? parameter.label2,
                    status: prev[parameter.id]?.status ?? parameter.status,
                  },
                }));
              }}
              disabled={!isEditing}
            />
            {isEditing && (
              <p className="text-xs text-gray-500 mt-2">
                Selected tenors:{' '}
                {selectedTenors.length > 0 ? selectedTenors.join(', ') : 'None'}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-y-5 items-start">
        <div className="flex flex-wrap justify-between items-center gap-2.5 w-full">
          <p className="text-sm md:text-base text-primary-200">
            System parameter for {parameter?.name}
          </p>
          <div className="flex items-center gap-3">
            <Switch
              isChecked={
                editedValues[parameter.id]?.status
                  ? editedValues[parameter.id]?.status === 'Active'
                  : parameter.status === 'Active'
              }
              onChange={(checked) => {
                setParameters((prev) =>
                  prev.map((p) =>
                    p.id === parameter.id
                      ? { ...p, status: checked ? 'Active' : 'Inactive' }
                      : p
                  )
                );
                setEditedValues((prev) => ({
                  ...prev,
                  [parameter.id]: {
                    ...(prev[parameter.id] || {
                      value: parameter.value,
                      value2: parameter.value2,
                      label: parameter.label,
                      label2: parameter.label2,
                    }),
                    status: checked ? 'Active' : 'Inactive',
                  },
                }));
              }}
            />
            <PencilSquareIcon
              className="h-6 w-6 text-gray-400 hover:text-secondary-200 cursor-pointer"
              onClick={() => toggleEditSection(index)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3.5">
          <div className="flex flex-col gap-y-1.5 w-full md:w-1/2">
            <p className="text-sm font-medium text-gray-500">
              {parameter.label || 'Label'}
            </p>
            <div className="w-full">
              <input
                type="text"
                value={
                  isEditing
                    ? valueRaw
                    : shouldFormat(valueRaw)
                    ? formatNumber(valueRaw)
                    : valueRaw
                }
                onChange={(e) => {
                  const raw = stripFormatting(e.target.value);
                  setEditedValues((prev) => ({
                    ...prev,
                    [parameter.id]: {
                      value: raw,
                      value2: prev[parameter.id]?.value2 ?? parameter.value2,
                      label: prev[parameter.id]?.label ?? parameter.label,
                      label2: prev[parameter.id]?.label2 ?? parameter.label2,
                      status: prev[parameter.id]?.status ?? parameter.status,
                    },
                  }));
                }}
                disabled={!isEditing}
                className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-lg outline-0 focus:border-2 focus:border-secondary-200/60 disabled:cursor-not-allowed disabled:text-gray-400 disabled:outline-0"
              />
            </div>
          </div>
          {parameter.value2 !== '0' && parameter.value2 !== '0.00' && (
            <div className="flex flex-col gap-y-1.5 w-full md:w-1/2">
              <p className="text-sm font-medium text-gray-500">
                {parameter.label2 || 'Label 2'}
              </p>
              <div className="w-full">
                <input
                  type="text"
                  value={
                    isEditing
                      ? value2Raw
                      : shouldFormat(value2Raw)
                      ? formatNumber(value2Raw)
                      : value2Raw
                  }
                  onChange={(e) => {
                    const raw = stripFormatting(e.target.value);
                    setEditedValues((prev) => ({
                      ...prev,
                      [parameter.id]: {
                        value: prev[parameter.id]?.value ?? parameter.value,
                        value2: raw,
                        label: prev[parameter.id]?.label ?? parameter.label,
                        label2: prev[parameter.id]?.label2 ?? parameter.label2,
                        status: prev[parameter.id]?.status ?? parameter.status,
                      },
                    }));
                  }}
                  disabled={!isEditing}
                  className="rounded-md border border-gray-100 w-full px-3 h-12 placeholder:text-[#9a9a9a] text-lg outline-0 focus:border-2 focus:border-secondary-200/60 disabled:cursor-not-allowed disabled:text-gray-400 disabled:outline-0"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-secondary-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row">
        {/* Tab Buttons */}
        {isMobile ? (
          <div className="w-full flex flex-col gap-3">
            {parameters.map((parameter, idx) => (
              <div key={parameter.id} className="w-full">
                <button
                  className={`bg-white w-full text-left px-5 py-3.5 font-medium transition-all duration-700 shadow ${
                    openTab === idx
                      ? 'border-l-[6px] border-l-secondary-300 border-t border-t-[#eee] text-secondary-200'
                      : 'hover:bg-secondary-100 border border-[#eee] text-gray-400'
                  }`}
                  onClick={() => handleToggle(idx)}
                >
                  {parameter.name}
                </button>
                {/* Collapsible content */}
                {openTab === idx && (
                  <div className="px-4 py-5 border border-t-0 border-[#eee] bg-[#f9f9f9] rounded-b-md shadow animate-fade-in">
                    {renderParameterContent(parameter, idx)}
                  </div>
                )}
              </div>
            ))}
            <div className="bg-white flex justify-end gap-2.5 mt-5 md:mt-8">
              <Button
                className="bg-secondary-200 !text-sm !w-fit !px-6 !py-2"
                onClick={handleParameterUpdate}
                disabled={isUpdating || Object.keys(editedValues).length === 0}
              >
                {isUpdating ? (
                  <div className="flex justify-center items-center gap-x-4">
                    <Loader2 className="animate-spin w-6 h-6 text-white" />
                    <p className="text-sm">Updating...</p>
                  </div>
                ) : (
                  'Update'
                )}
              </Button>
              <Button
                onClick={openSideModal}
                className="border border-secondary-200 !text-secondary-200 !text-sm !w-fit !px-6 flex gap-1 items-center hover:bg-secondary-200 hover:!text-white !py-2"
              >
                <SquaresPlusIcon className="w-4 h-4" /> Add New
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 gap-8 lg:gap-10 items-start">
            <div>
              {parameters.map((parameter, idx) => (
                <button
                  key={parameter.id}
                  className={`bg-white w-full text-left px-5 py-3.5 mb-1.5 font-medium transition-all duration-700 ${
                    activeTab === idx
                      ? 'border-l-[6px] border-l-secondary-200 border-t border-t-[#eee] text-secondary-200 shadow-md'
                      : 'hover:bg-secondary-100 border border-[#eee] text-gray-400 shadow-sm'
                  }`}
                  onClick={() => setActiveTab(idx)}
                >
                  {parameter.name}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            <div className="col-span-2">
              <div className="bg-white rounded-md shadow border border-[#f6f6f6] px-6 md:p-8">
                {parameters[activeTab] &&
                  renderParameterContent(parameters[activeTab], activeTab)}
              </div>

              <div className="bg-white flex justify-end gap-2.5 mt-5 md:mt-8">
                <Button
                  className="bg-secondary-200 !text-sm !w-fit !px-6 !py-2"
                  onClick={handleParameterUpdate}
                  disabled={
                    isUpdating || Object.keys(editedValues).length === 0
                  }
                >
                  {isUpdating ? (
                    <div className="flex justify-center items-center gap-x-4">
                      <Loader2 className="animate-spin w-6 h-6 text-white" />
                      <p className="text-sm">Updating...</p>
                    </div>
                  ) : (
                    'Update'
                  )}
                </Button>
                <Button
                  onClick={openSideModal}
                  className="border border-secondary-200 !text-secondary-200 !text-sm !w-fit !px-6 flex gap-1 items-center hover:bg-secondary-200 hover:!text-white !py-2"
                >
                  <SquaresPlusIcon className="w-4 h-4" /> Add New
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <SideModal isOpen={openModal} onClose={closeModal}>
        <NewParameterForm onClose={closeModal} onSuccess={fetchParameters} />
      </SideModal>
    </div>
  );
};

export default SystemParameters;
