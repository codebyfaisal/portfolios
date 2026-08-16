import { ApiError } from "../utils/ApiError.js";
import { NODE_ENV } from "../constants.js";

const errorHandler = (err, req, res, next) => {
    if (NODE_ENV === "development") {
        console.error("Express Error Handler:", err);
    }
    let error = err;

    if (!(error instanceof ApiError)) {
        if (error.name === "ValidationError") {
            const message = Object.values(error.errors)
                .map((val) => val.message)
                .join(", ");
            error = new ApiError(400, message, error.errors, error.stack);
        } else if (error.name === "CastError") {
            error = new ApiError(400, "Either the form ID is invalid or the form does not exist", [], error.stack);
        } else {
            const statusCode = error.statusCode || 500;
            const message = NODE_ENV === "production" ? "Internal Server Error" : (error.message || "Something went wrong");
            error = new ApiError(statusCode, message, error?.errors || [], error.stack);
        }
    }

    const response = {
        ...error,
        message: error.message,
        ...(NODE_ENV === "development" ? { stack: error.stack } : {}),
    };

    return res.status(error.statusCode).json(response);
};

export { errorHandler };
