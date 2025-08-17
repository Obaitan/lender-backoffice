'use client';

import { useState } from 'react';
import { Dropdown } from '@/components/general/Dropdown';
import { BarsArrowDownIcon } from '@heroicons/react/24/solid'; // Assuming this icon is still desired
import ContactCustomer from '@/components/modals/ContactCustomer';

const CustomerActionsComponent = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleSendMessage = (
    subject: string,
    message: string,
    files: File[]
  ) => {
    // Implement logic to send message with attachments
    console.log('Sending message:', { subject, message, files });
    // You would typically send this data to an API route here

    // Close modal after sending
    setIsContactModalOpen(false);
  };

  const handleDropdownItemClick = (label: string) => {
    if (label === 'Contact Customer') {
      setIsContactModalOpen(true);
    }
    // Handle other dropdown items here if needed
  };

  const dropdownItems = [
    { label: 'Contact Customer' },
    { label: 'Export Records' },
  ];

  return (
    <>
      <Dropdown
        buttonLabel="Actions"
        icon={<BarsArrowDownIcon className="h-4 w-4" />}
        items={dropdownItems}
        onItemClick={handleDropdownItemClick}
      />

      <ContactCustomer
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSendMessage={handleSendMessage}
      />
    </>
  );
};

export default CustomerActionsComponent;
