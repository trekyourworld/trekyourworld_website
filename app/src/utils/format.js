/**
 * Formats a number as Indian Rupees (INR)
 * Example: 100000 becomes "₹1,00,000"
 * 
 * @param {number|string} amount - The amount to format
 * @param {boolean} showSymbol - Whether to include the ₹ symbol (default: true)
 * @param {boolean} showDecimals - Whether to show decimal places (default: false)
 * @returns {string} Formatted price string
 */
export const formatIndianRupees = (amount, showSymbol = true, showDecimals = false) => {
  if (amount === undefined || amount === null) {
    return showSymbol ? '₹0' : '0';
  }
  
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Return 0 if NaN
  if (isNaN(numAmount)) {
    return showSymbol ? '₹0' : '0';
  }
  
  // Format with Indian numbering system (lakhs, crores)
  const options = {
    style: 'decimal',
    useGrouping: true,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  };
  
  // Use the Indian locale for numbering system
  const formattedNumber = numAmount.toLocaleString('en-IN', options);
  
  // Add the Rupee symbol if required
  return showSymbol ? `₹${formattedNumber}` : formattedNumber;
};

/**
 * Formats a price for display, adding "onwards" if needed
 * 
 * @param {number|string} price - The price to format
 * @param {boolean} isStartingPrice - Whether this is a starting price (default: true)
 * @returns {string} Formatted price string
 */
export const formatTrekPrice = (price, isStartingPrice = true) => {
  const formattedPrice = formatIndianRupees(price);
  return isStartingPrice ? `${formattedPrice} onwards` : formattedPrice;
};