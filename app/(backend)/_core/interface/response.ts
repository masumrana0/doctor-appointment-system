export type ISendApiResponse<T = any> = {
  success: boolean;
  status: number;
  message?: string;
  data?: T;
  meta?: IMeta;
};

export type IMeta = {
  page: number;
  limit: number;
  total?: number;
};

export type IErrorMessage = {
  path: string;
  message: string;
};

export type IErrorResponse = {
  succces: boolean;
  message: string;
  errorMessages: IErrorMessage[];
  stack?: any;
};
