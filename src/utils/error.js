export default class BaseError extends Error {
    constructor({ message, stack, action, statusCode, errorLocationCode }) {
        super();
        this.message = message;
        this.stack = stack;
        this.action = action;
        this.status_code = statusCode || 500;
        this.error_location_code = errorLocationCode;
        this.name = this.constructor.name;
    }
}
