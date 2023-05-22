import { HttpException } from './httpException';
import { HttpStatusCode } from './httpStatusCode';

export class NotFoundException extends HttpException {
  constructor(message = 'Not Found') {
    super(HttpStatusCode.NOT_FOUND, message);
  }
}
