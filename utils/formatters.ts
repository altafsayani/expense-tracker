/**
 * Utility functions for formatting various data types
 */

/**
 * Format a number as Pakistani Rupees with thousand separators
 * @param amount - The number to format
 * @returns Formatted string with Rs. symbol and thousand separators
 */
export const formatCurrency = (amount: number): string => {
  return `Rs. ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}; 