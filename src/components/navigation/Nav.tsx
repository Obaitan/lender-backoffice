'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import HeaderComponent from './Header';
import { useScreenSize } from '@/hooks/useScreenSize';

export const NavComponent = () => {
  const { width } = useScreenSize();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Function to open mobile sidebar
  const openMobileSidebar = () => setIsMobileSidebarOpen(true);

  // Function to close mobile sidebar
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  return (
    <>
      {width < 1200 ? (
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={closeMobileSidebar}
        />
      ) : (
        <Sidebar />
      )}
      <HeaderComponent openSidebar={openMobileSidebar} />
    </>
  );
};
