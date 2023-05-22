import { BadRequestException } from './badRequestException';
import { HttpStatusCode } from './httpStatusCode';

describe('BadRequestException', () => {
  it('should create an instance with the default status code and message', () => {
    const badRequestException = new BadRequestException();

    expect(badRequestException.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    expect(badRequestException.message).toBe('Bad Request');
    expect(badRequestException.errors).toBeUndefined();
  });

  it('should create an instance with the provided message and errors', () => {
    const message = 'Custom Bad Request';
    const errors = ['Error 1', 'Error 2'];
    const badRequestException = new BadRequestException(message, errors);

    expect(badRequestException.statusCode).toBe(HttpStatusCode.BAD_REQUEST);
    expect(badRequestException.message).toBe(message);
    expect(badRequestException.errors).toEqual(errors);
  });
});
