import { AErrors, ErrorModel } from "../models/ErrorModel";
export default class Errors extends AErrors {
  LOGIN_ERROR: ErrorModel = {
    status: 502,
    code: "SP-000",
    message: "Login Error",
  };
  INVALID_USER: ErrorModel = {
    status: 401,
    code: "SP-001",
    message: "INVALID USER",
  };
}
