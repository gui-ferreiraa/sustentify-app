export interface IHttpError {
  status: number;
  error?: {
    status?: string;
    [key: string]: any;
  };
}
