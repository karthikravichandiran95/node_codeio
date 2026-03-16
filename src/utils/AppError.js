// AppError - Custom Error Class
// Normal Error la status code kedaiyaathu, adhaan idha use pandrom
// Example: throw new AppError("User not found", 404)

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  }
}

module.exports = AppError;
