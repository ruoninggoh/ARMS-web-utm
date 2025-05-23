export interface ApiError {
  response?: {
    data?: {
      Message?: string;
      Errors?: Record<string, string[]>;
    };
  };
  message?: string;
}
