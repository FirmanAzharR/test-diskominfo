class ApplicationError extends Error {
    constructor(message, status, httpCode) {
        super();

        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;

        this.message = message || 'Internal Server Error.';

        this.status = status || 500;

        this.httpCode = httpCode || 200;
    }
}


class ValidationError extends ApplicationError {
    constructor(message, status, httpCode) {
        super(message || 'Validation Error.', status || 102, httpCode || 400);
    }
}


class DatabaseError extends ApplicationError {
    constructor(message, status, httpCode) {
        super(message || 'Database Error.', status || 200, httpCode || 500);
    }
}


class AuthorizationError extends ApplicationError {
    constructor(message, status, httpCode) {
        super(message || 'Unauthorized.', status || 107, httpCode || 401);
    }
}


module.exports = {
    ApplicationError,
    AuthorizationError,
    ValidationError,
    DatabaseError
};