import { HttpException } from './httpException';
import { HttpStatusCode } from './httpStatusCode';

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(HttpStatusCode.UNAUTHORIZED, message);
  }
}
