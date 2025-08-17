/**
 * Helper function to get the full image URL for customer pictures
 * @param filePath - The relative file path from API response
 * @returns Full absolute URL or fallback to avatar
 */
export function getCustomerImageUrl(filePath?: string): string {
  if (!filePath) {
    return '/images/avatar.svg';
  }
  
  // If filePath is already a full URL, return it as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  // If filePath starts with '/', it's already a proper absolute path
  if (filePath.startsWith('/')) {
    return filePath;
  }
  
  // Otherwise, construct the full URL with the API base URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://paylaterhub.com/service-sandbox';
  return `${baseUrl}/${filePath}`;
}

export function formatDate(
  date: string | number | Date,
  showTime: boolean = true,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  try {
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      console.warn('Invalid date');
      return '';
    }

    // Check if the input date string contains time components
    const hasTimeComponent =
      typeof date === 'string' &&
      (date.includes('T') || date.includes(':') || date.includes(' '));

    // Add time options only if the input has time components and showTime is true
    const formatOptions: Intl.DateTimeFormatOptions = {
      ...options,
      ...(hasTimeComponent &&
        showTime && {
          hour: 'numeric' as const,
          minute: 'numeric' as const,
        }),
    };

    return new Intl.DateTimeFormat(locale, formatOptions).format(parsedDate);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

export function formatNumber(
  value: string | number,
  locale: string = 'en-US',
  showTwoDecimals: boolean = false
): string {
  try {
    const number = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(number)) {
      console.warn(`Invalid number`);
    }
    const options = showTwoDecimals
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : undefined;
    return new Intl.NumberFormat(locale, options).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return '';
  }
}

export function formatCurrency(
  value: string | number,
  currency: string = 'NGN',
  locale: string = 'en-NG'
): string {
  try {
    const number = typeof value === 'string' ? parseFloat(value) : value;
    if (Number.isNaN(number)) {
      console.warn(`Invalid number for currency formatting: ${value}`);
      return '₦0.00';
    }
    
    // For NGN, use custom formatting to show ₦ symbol
    if (currency === 'NGN') {
      return `₦${new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(number)}`;
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '₦0.00';
  }
}

export function maskMiddleDigits(accountNumber: string | number): string {
  const number = accountNumber.toString();

  // Ensure it's a 10-digit number
  // if (!/^\d{10}$/.test(phoneStr)) {
  //   throw new Error(
  //     'Input must be a 10-digit number or string containing only digits.'
  //   );
  // }

  // Replace the middle six digits with asterisks
  return number.slice(0, 2) + '******' + number.slice(8);
}

export function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInWeek = 7 * secondsInDay;
  const secondsInMonth = 30 * secondsInDay;

  if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < secondsInWeek) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (diffInSeconds < secondsInMonth) {
    const weeks = Math.floor(diffInSeconds / secondsInWeek);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
}

export function truncateString(text: string, maxLength?: number): string {
  const limit = maxLength ?? 70;
  if (text.length > limit) {
    return text.slice(0, limit) + '...';
  }
  return text;
}

export function maskInput(
  input: string | number | undefined | null,
  visibleCount: number = 4
): string {
  if (!input) return '';
  const str = input.toString();
  if (visibleCount <= 0) return '*'.repeat(str.length);
  if (str.length <= visibleCount) return str;
  const maskedLength = str.length - visibleCount;
  return '*'.repeat(maskedLength) + str.slice(-visibleCount);
}

/**
 * Exports an array of objects as a CSV file and triggers download in the browser.
 * @param data Array of objects to export
 * @param filename Name of the CSV file (default: 'export.csv')
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename = 'export.csv'
) {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }
  // Get all unique keys from all objects (to handle missing fields)
  const allKeys = Array.from(
    data.reduce((keys, row) => {
      Object.keys(row).forEach((key) => keys.add(key));
      return keys;
    }, new Set<string>())
  );
  // CSV header
  const header = allKeys.join(',');
  // CSV rows
  const rows = data.map((row) =>
    allKeys
      .map((key) => {
        let value = row[key];
        if (value === null || value === undefined) value = '';
        // Escape quotes and commas
        if (typeof value === 'string') {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      })
      .join(',')
  );
  const csvContent = [header, ...rows].join('\r\n');
  // Create a blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Constructs the full image URL by combining the API base URL with the relative file path
 * @param filePath - The relative file path from the API response
 * @returns The complete image URL or fallback avatar path
 */
export const getImageUrl = (filePath?: string): string => {
  if (!filePath) {
    return '/images/avatar.svg';
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    console.warn('NEXT_PUBLIC_API_BASE_URL is not defined');
    return '/images/avatar.svg';
  }
  
  // Remove leading slash from filePath if present to avoid double slashes
  const cleanFilePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  
  return `${baseUrl}/${cleanFilePath}`;
};
