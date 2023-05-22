import { HttpException } from './httpException';
import { HttpStatusCode } from './httpStatusCode';

export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request', errors?: string[]) {
    super(HttpStatusCode.BAD_REQUEST, message, errors);
  }
}
