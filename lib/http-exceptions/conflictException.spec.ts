import { ConflictException } from './conflictException';
import { HttpStatusCode } from './httpStatusCode';

describe('ConflictException', () => {
  it('should create an instance with the default status code and message', () => {
    const conflictException = new ConflictException();

    expect(conflictException.statusCode).toBe(HttpStatusCode.CONFLICT);
    expect(conflictException.message).toBe('Conflict');
    expect(conflictException.errors).toBeUndefined();
  });

  it('should create an instance with the provided custom message', () => {
    const message = 'Custom Conflict';
    const conflictException = new ConflictException(message);

    expect(conflictException.statusCode).toBe(HttpStatusCode.CONFLICT);
    expect(conflictException.message).toBe(message);
    expect(conflictException.errors).toBeUndefined();
  });
});
