import { HttpException } from './httpException';
import { HttpStatusCode } from './httpStatusCode';

export class ConflictException extends HttpException {
  constructor(message = 'Conflict') {
    super(HttpStatusCode.CONFLICT, message);
  }
}
