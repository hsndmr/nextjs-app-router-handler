import { HttpException } from './httpException';
import { HttpStatusCode } from './httpStatusCode';

export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden') {
    super(HttpStatusCode.FORBIDDEN, message);
  }
}
