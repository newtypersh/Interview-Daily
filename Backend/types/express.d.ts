declare namespace Express {
  export interface User {
    id: string;
    email?: string;
    name?: string;
  }
  export interface Response {
    success(success: any): this;
    error(error: {
      errorCode?: string;
      reason?: string | null;
      data?: any | null;
    }): this;
  }
}