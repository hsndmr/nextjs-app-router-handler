import { HttpStatusCode } from './httpStatusCode';

export class HttpException extends Error {
  public statusCode: HttpStatusCode;
  public errors?: string[];

  constructor(statusCode: number, message: string, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
