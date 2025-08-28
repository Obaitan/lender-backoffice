'use client';

import { ReactNode, useEffect, useState } from 'react';
import { formatDate } from '@/utils/functions';
import { CustomerTable } from '@/types';
import SideModal from '@/components/layout/SideModal';
import AddCustomerForm from '@/components/customers/AddCustomerForm';
import Tooltip from '@/components/general/Tooltip';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import { PeriodFilterContext } from '@/contexts/PeriodFilterContext';
import { ExportProvider } from '@/components/table/MultiTableExportButton';
import TabsWithMetrics from '@/components/navigation/TabsWithMetrics';
// Add dummy data import
import {
  getDummyActiveCustomers,
  getDummySuspendedCustomers,
} from '@/utils/customerDummyData';

export default function CustomersLayout({ children }: { children: ReactNode }) {
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [appliedRange, setAppliedRange] = useState<{ from?: Date; to?: Date }>(
    {}
  );

  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        // Replace API calls with dummy data
        const activeCustomers = getDummyActiveCustomers();
        const suspendedCustomers = getDummySuspendedCustomers();

        // Transform active customers data (keeping existing transformation logic)
        activeCustomers.map((customer: CustomerTable) => ({
          id: customer.id,
          customerID: customer.customerID,
          name: customer.name,
          phoneNumber: customer.phoneNumber,
          email: customer.email,
          rmCode: customer.rmCode,
          signUpDate: formatDate(customer.signUpDate),
          status: customer.status || 'Active',
        }));

        // Transform suspended customers data (keeping existing transformation logic)
        suspendedCustomers.map((customer: CustomerTable) => ({
          id: customer.id,
          customerID: customer.customerID,
          name: customer.name,
          phoneNumber: customer.phoneNumber,
          email: customer.email,
          rmCode: customer.rmCode,
          signUpDate: formatDate(customer.signUpDate),
          status: customer.status || 'Suspended',
        }));
      } catch (error) {
        console.error('Error fetching customers data:', error);
      }
    };

    fetchCustomersData();
  }, [refreshKey]);

  const handleCustomerCreated = () => {
    setShowAddCustomerModal(false);
    setRefreshKey((prev) => prev + 1); // Trigger refresh
    // Dispatch event to notify customer pages to refresh
    window.dispatchEvent(new CustomEvent('customerCreated'));
  };

  const customersPageTabs = [
    {
      label: 'Active',
      url: 'active',
      value: 3,
      difference: 1,
    },
    { label: 'Suspended', url: 'suspended', value: 2, difference: 2 },
  ];

  return (
    <ExportProvider availableTabs={customersPageTabs}>
      <PeriodFilterContext.Provider value={{ appliedRange, setAppliedRange }}>
        <div className="relative">
          <TabsWithMetrics
            pageTitle="Customers"
            links={customersPageTabs}
            filter
            appliedRange={appliedRange}
            setAppliedRange={setAppliedRange}
          />

          <Tooltip
            content="Add Customer"
            className="!left-[88%] !-mb-[72px] md:!-mb-6"
          >
            <button
              onClick={() => setShowAddCustomerModal(true)}
              className="flex items-center justify-center text-secondary-200 h-9 w-9 rounded-full border border-secondary-200 hover:bg-secondary-200 hover:text-white absolute right-12 2xl:right-14 top-8 md:top-[33px]"
            >
              <UserPlusIcon className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
        <div className="mt-8" key={refreshKey}>
          {children}
        </div>
        {/* Add Customer Modal */}
        <SideModal
          isOpen={showAddCustomerModal}
          onClose={() => setShowAddCustomerModal(false)}
        >
          <AddCustomerForm onCustomerCreated={handleCustomerCreated} />
        </SideModal>
      </PeriodFilterContext.Provider>
    </ExportProvider>
  );
}
