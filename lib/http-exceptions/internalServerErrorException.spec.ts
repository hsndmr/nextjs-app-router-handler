import { InternalServerErrorException } from './internalServerErrorException';
import { HttpStatusCode } from './httpStatusCode';

describe('InternalServerErrorException', () => {
  it('should create an instance with the default status code and message', () => {
    const internalServerErrorException = new InternalServerErrorException();

    expect(internalServerErrorException.statusCode).toBe(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
    expect(internalServerErrorException.message).toBe('Internal Server Error');
    expect(internalServerErrorException.errors).toBeUndefined();
  });

  it('should create an instance with the provided custom message', () => {
    const message = 'Custom Internal Server Error';
    const internalServerErrorException = new InternalServerErrorException(
      message,
    );

    expect(internalServerErrorException.statusCode).toBe(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
    expect(internalServerErrorException.message).toBe(message);
    expect(internalServerErrorException.errors).toBeUndefined();
  });
});
