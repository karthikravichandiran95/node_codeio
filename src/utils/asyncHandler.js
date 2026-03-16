// asyncHandler - try-catch wrapper
// Ella route la try-catch ezhudha vendaam
// Error vandhaa automatic ah error middleware ku anuppum

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    next(error);
  });
};

module.exports = asyncHandler;
