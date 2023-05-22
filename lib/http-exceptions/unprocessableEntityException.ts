import { HttpException } from './httpException';
import { HttpStatusCode } from './httpStatusCode';

export class UnprocessableEntityException extends HttpException {
  constructor(message = 'Unprocessable Entity') {
    super(HttpStatusCode.UNPROCESSABLE_ENTITY, message);
  }
}
