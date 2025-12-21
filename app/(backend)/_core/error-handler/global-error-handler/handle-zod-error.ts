import { z } from "zod";
import { IErrorMessage } from "../../interface/response";

export const handleZodError = (error: z.ZodError) => {
  const errorMessages: IErrorMessage[] = error.errors.map((err: any) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages,
  };
};
