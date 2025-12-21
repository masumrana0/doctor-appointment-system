export const handleCastError = (error: any) => {
  return {
    statusCode: 400,
    message: "Invalid ID",
    errorMessages: [
      {
        path: error.path,
        message: "Invalid ID format",
      },
    ],
  };
};
