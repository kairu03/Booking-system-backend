// custom error class for api errors
export class ApiError extends Error {
  constructor(message, statusCode) {

    // calls parents class constructor Error with the msg 
    super(message);
    this.statusCode = statusCode; 
    this.name = this.constructor.name;

    // will point exactly to where the error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}