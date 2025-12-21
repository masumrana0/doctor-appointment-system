import { IErrorMessage } from "../../interface/response";
import { NextResponse } from "next/server";
import { z } from "zod";
import { handleZodError } from "./handle-zod-error";
import { handleValidationError } from "./handle-validation";
import { handleCastError } from "./handle-cast-error";
import { ApiError } from "next/dist/server/api-utils";

export async function GlobalErrorHandler(error: any) {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages: IErrorMessage[] = [];
  let stack;

  // Handle different types of errors
  if (error instanceof z.ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    stack = error.stack;
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = [
      {
        path: "",
        message: error.message,
      },
    ];
    stack = error.stack;
  }

  // Return error response
  return NextResponse.json(
    {
      success: false,
      message,
      errorMessages,
      stack: process.env.NODE_ENV !== "production" ? stack : undefined,
    },
    {
      status: statusCode,
    }
  );
}
