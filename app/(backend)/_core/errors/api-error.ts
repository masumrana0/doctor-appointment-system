export class ApiError extends Error {
  code: string;
  status: number;
  details?: any;

  constructor({
    message,
    code = "INTERNAL_SERVER_ERROR",
    status = 500,
    details,
  }: {
    message: string;
    code?: string;
    status?: number;
    details?: any;
  }) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const ApiErrors = {
  BadRequest: (message: string, details?: any) =>
    new ApiError({
      message,
      code: "BAD_REQUEST",
      status: 400,
      details,
    }),
  Unauthorized: (message = "Authentication required", details?: any) =>
    new ApiError({
      message,
      code: "UNAUTHORIZED",
      status: 401,
      details,
    }),
  Forbidden: (
    message = "You do not have permission to access this resource",
    details?: any
  ) =>
    new ApiError({
      message,
      code: "FORBIDDEN",
      status: 403,
      details,
    }),
  NotFound: (message = "Resource not found", details?: any) =>
    new ApiError({
      message,
      code: "NOT_FOUND",
      status: 404,
      details,
    }),
  ValidationError: (message = "Validation failed", details?: any) =>
    new ApiError({
      message,
      code: "VALIDATION_ERROR",
      status: 422,
      details,
    }),
  InternalServerError: (
    message = "An unexpected error occurred",
    details?: any
  ) =>
    new ApiError({
      message,
      code: "INTERNAL_SERVER_ERROR",
      status: 500,
      details,
    }),
};
