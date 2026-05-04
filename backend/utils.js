/**
 * Blood Type Compatibility Matrix
 * 
 * Determines if a donor blood type can be given to a recipient blood type.
 * @param {string} donorType - The blood type of the donor (e.g., 'O-', 'A+')
 * @param {string} recipientType - The blood type of the recipient (e.g., 'AB+', 'B-')
 * @returns {boolean} - True if compatible, false otherwise
 */
const isCompatible = (donorType, recipientType) => {
  const compatibilityMap = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
  };

  return compatibilityMap[donorType]?.includes(recipientType) || false;
};

/**
 * Get all compatible donor types for a specific recipient type
 * @param {string} recipientType 
 * @returns {string[]} - Array of compatible donor blood types
 */
const getCompatibleDonorTypes = (recipientType) => {
  const allTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  return allTypes.filter(donorType => isCompatible(donorType, recipientType));
};

module.exports = {
  isCompatible,
  getCompatibleDonorTypes
};
