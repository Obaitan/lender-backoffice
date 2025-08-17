'use client';

import { useRouter } from 'next/navigation';
import { Row } from '@tanstack/react-table';
import Cookies from 'js-cookie';

export function useNavigateToDetailsPage<
  T extends { id: number; phoneNumber?: string; customerID?: string }
>() {
  const router = useRouter();

  return (row: Row<T>) => {
    const { id, phoneNumber, customerID } = row.original;

    if (phoneNumber && customerID) {
      // Save phone number and customer ID as cookies
      Cookies.set('phoneNumber', phoneNumber, { expires: 1, path: '/' });
      Cookies.set('customerID', customerID, { expires: 1, path: '/' });
    }

    if (id) {
      router.push(`/customer-information/${id}`);
    }
  };
}
