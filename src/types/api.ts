export type ApiSuccess<T = unknown> = {
  message: string;
  data?: T;
};

export type ApiError = {
  message: string;
  error?: string;
};
