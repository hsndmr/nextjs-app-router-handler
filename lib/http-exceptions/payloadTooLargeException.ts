import { HttpException } from './httpException';
import { HttpStatusCode } from './httpStatusCode';

export class PayloadTooLargeException extends HttpException {
  constructor(message = 'Payload Too Large') {
    super(HttpStatusCode.PAYLOAD_TOO_LARGE, message);
  }
}
