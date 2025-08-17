// utils/dateUtils.ts

/**
 * Formats a date string into a consistent format
 * Handles various date formats and returns a standardized string
 * 
 * @param dateString - The date string to format
 * @param options - Date formatting options
 * @returns Formatted date string
 */
export const formatDateString = (
    dateString: string | undefined,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  ): string => {
    if (!dateString) return 'N/A';
    
    try {
      // Try to parse the date
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        // If parsing fails, just return the original string
        return dateString;
      }
      
      // Format the date
      return date.toLocaleDateString('en-US', options);
    } catch {
      // If any error occurs, return the original string
      return dateString;
    }
  };
  
  /**
   * Determines if a date is in the past (overdue)
   * 
   * @param dateString - The date string to check
   * @returns Boolean indicating if the date is overdue
   */
  export const isOverdue = (dateString: string | undefined): boolean => {
    if (!dateString) return false;
    
    try {
      const date = new Date(dateString);
      const today = new Date();
      
      // Remove time portion for fair comparison
      today.setHours(0, 0, 0, 0);
      
      return date < today;
    } catch {
      return false;
    }
  };
  
  /**
   * Calculate days between two dates (useful for showing days overdue)
   * 
   * @param dateString - The date to compare against
   * @param compareDate - The date to compare with (defaults to current date)
   * @returns Number of days between dates
   */
  export const getDaysDifference = (
    dateString: string | undefined,
    compareDate: Date = new Date()
  ): number => {
    if (!dateString) return 0;
    
    try {
      const date = new Date(dateString);
      
      // Calculate difference in milliseconds
      const diffTime = Math.abs(date.getTime() - compareDate.getTime());
      
      // Convert to days
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays;
    } catch {
      return 0;
    }
  };