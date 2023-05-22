import { ForbiddenException } from './forbiddenException';
import { HttpStatusCode } from './httpStatusCode';

describe('ForbiddenException', () => {
  it('should create an instance with the default status code and message', () => {
    const forbiddenException = new ForbiddenException();

    expect(forbiddenException.statusCode).toBe(HttpStatusCode.FORBIDDEN);
    expect(forbiddenException.message).toBe('Forbidden');
    expect(forbiddenException.errors).toBeUndefined();
  });

  it('should create an instance with the provided custom message', () => {
    const message = 'Custom Forbidden';
    const forbiddenException = new ForbiddenException(message);

    expect(forbiddenException.statusCode).toBe(HttpStatusCode.FORBIDDEN);
    expect(forbiddenException.message).toBe(message);
    expect(forbiddenException.errors).toBeUndefined();
  });
});
