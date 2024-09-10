class AppError extends
    Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode

        Error.captureStackTrace(this, this.constructor); // stacktrace meaning in which line in which para error i s showing
    }
}

export default AppError;
// export default AppError;