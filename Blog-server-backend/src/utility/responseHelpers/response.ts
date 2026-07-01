export const ReturnErrorResponse = <T>(message: string, error?: T) => {
  return {
    success: false,
    message: message,
    error,
  };
};

export const ReturnSuccessResponse = <T>(message: string, data?: T) => {
  return {
    success: true,
    message,
    data,
  };
};
