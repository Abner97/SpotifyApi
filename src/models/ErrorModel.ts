export interface ErrorModel {
  status: number;
  code: string;
  message: string;
}

export abstract class AErrors {
  static LOGIN_ERROR: ErrorModel;
  static INVALID_USER: ErrorModel;
}
