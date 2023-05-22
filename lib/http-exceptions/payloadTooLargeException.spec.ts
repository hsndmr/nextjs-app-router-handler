import { PayloadTooLargeException } from './payloadTooLargeException';
import { HttpStatusCode } from './httpStatusCode';

describe('PayloadTooLargeException', () => {
  it('should create an instance with the default status code and message', () => {
    const payloadTooLargeException = new PayloadTooLargeException();

    expect(payloadTooLargeException.statusCode).toBe(
      HttpStatusCode.PAYLOAD_TOO_LARGE,
    );
    expect(payloadTooLargeException.message).toBe('Payload Too Large');
    expect(payloadTooLargeException.errors).toBeUndefined();
  });

  it('should create an instance with the provided custom message', () => {
    const message = 'Custom Payload Too Large';
    const payloadTooLargeException = new PayloadTooLargeException(message);

    expect(payloadTooLargeException.statusCode).toBe(
      HttpStatusCode.PAYLOAD_TOO_LARGE,
    );
    expect(payloadTooLargeException.message).toBe(message);
    expect(payloadTooLargeException.errors).toBeUndefined();
  });
});
