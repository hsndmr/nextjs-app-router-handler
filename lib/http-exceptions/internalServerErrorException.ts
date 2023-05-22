import { HttpException } from './httpException';
import { HttpStatusCode } from './httpStatusCode';

export class InternalServerErrorException extends HttpException {
  constructor(message = 'Internal Server Error') {
    super(HttpStatusCode.INTERNAL_SERVER_ERROR, message);
  }
}
