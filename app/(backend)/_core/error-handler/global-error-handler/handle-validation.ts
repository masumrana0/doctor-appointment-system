import { IErrorMessage } from "../../interface/response";

export const handleValidationError = (error: any) => {
  const errorMessages: IErrorMessage[] = Object.keys(error.errors).map(
    (key) => ({
      path: key,
      message: error.errors[key].message,
    })
  );

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages,
  };
};
