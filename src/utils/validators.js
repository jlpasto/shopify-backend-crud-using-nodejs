const validateProduct = (input) => {
  const errors = [];
  
  if (!input.title || input.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (input.title && input.title.length > 255) {
    errors.push('Title must be less than 255 characters');
  }
  
  if (!input.variants || input.variants.length === 0) {
    errors.push('At least one variant is required');
  }
  
  if (input.variants) {
    input.variants.forEach((variant, index) => {
      const variantValidation = validateVariant(variant);
      if (!variantValidation.isValid) {
        variantValidation.errors.forEach(error => {
          errors.push(`Variant ${index + 1}: ${error}`);
        });
      }
    });
  }
  
  if (input.images) {
    input.images.forEach((image, index) => {
      const imageValidation = validateImage(image);
      if (!imageValidation.isValid) {
        imageValidation.errors.forEach(error => {
          errors.push(`Image ${index + 1}: ${error}`);
        });
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateVariant = (variant) => {
  const errors = [];
  
  if (!variant.title || variant.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (variant.price === undefined || variant.price === null) {
    errors.push('Price is required');
  }
  
  if (variant.price && (variant.price < 0 || variant.price > 999999)) {
    errors.push('Price must be between 0 and 999999');
  }
  
  if (variant.compareAtPrice && variant.compareAtPrice < 0) {
    errors.push('Compare at price must be positive');
  }
  
  if (variant.inventoryQuantity && variant.inventoryQuantity < 0) {
    errors.push('Inventory quantity must be positive');
  }
  
  if (variant.weight && variant.weight < 0) {
    errors.push('Weight must be positive');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateImage = (image) => {
  const errors = [];
  
  if (!image.src || image.src.trim().length === 0) {
    errors.push('Image source URL is required');
  }
  
  if (image.src && !isValidUrl(image.src)) {
    errors.push('Image source must be a valid URL');
  }
  
  if (image.width && (image.width < 1 || image.width > 10000)) {
    errors.push('Image width must be between 1 and 10000 pixels');
  }
  
  if (image.height && (image.height < 1 || image.height > 10000)) {
    errors.push('Image height must be between 1 and 10000 pixels');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

module.exports = {
  validateProduct,
  validateVariant,
  validateImage,
};