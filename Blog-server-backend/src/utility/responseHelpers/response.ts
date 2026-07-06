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

export const ReturnSuccessResponse = <T>(
  message: string,
  status: number,
  data?: T,
) => {
  return {
    success: true,
    status,
    message,
    data,
  };
};
