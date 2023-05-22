import { UnauthorizedException } from './unauthorizedException';
import { HttpStatusCode } from './httpStatusCode';

describe('UnauthorizedException', () => {
  it('should create an instance with the default status code and message', () => {
    const unauthorizedException = new UnauthorizedException();

    expect(unauthorizedException.statusCode).toBe(HttpStatusCode.UNAUTHORIZED);
    expect(unauthorizedException.message).toBe('Unauthorized');
    expect(unauthorizedException.errors).toBeUndefined();
  });

  it('should create an instance with the provided custom message', () => {
    const message = 'Custom Unauthorized';
    const unauthorizedException = new UnauthorizedException(message);

    expect(unauthorizedException.statusCode).toBe(HttpStatusCode.UNAUTHORIZED);
    expect(unauthorizedException.message).toBe(message);
    expect(unauthorizedException.errors).toBeUndefined();
  });
});
