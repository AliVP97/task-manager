export const validateTaskInput = (req, res, next) => {
  const { description, status } = req.body;
  const errors = [];
  
  // Validate description
  if (!description || typeof description !== 'string') {
    errors.push('Description is required and must be a string');
  } else if (description.trim().length === 0) {
    errors.push('Description cannot be empty');
  } else if (description.length > 500) {
    errors.push('Description must be 500 characters or less');
  }
  
  // Validate status (optional)
  if (status && !['pending', 'complete'].includes(status)) {
    errors.push('Status must be either "pending" or "complete"');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'Please check your input and try again',
      details: errors
    });
  }
  
  // Sanitize input
  req.body.description = description.trim();
  req.body.status = status || 'pending';
  
  next();
};