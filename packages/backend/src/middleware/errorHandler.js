export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }
  
  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({
      error: 'Database Constraint Error',
      message: 'The operation violates database constraints'
    });
  }
  
  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  });
};