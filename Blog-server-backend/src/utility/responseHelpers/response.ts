export const ReturnErrorResponse = <T>(
  message: string,
  status: number,
  error?: T,
) => {
  return {
    success: false,
    status,
    message: message,
    error,
  };
};

export const ReturnSuccessResponse = <T>(message: string, data?: T) => {
  return {
    success: true,
    status: 200,
    message,
    data,
  };
};
