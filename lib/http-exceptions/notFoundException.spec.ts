import { NotFoundException } from './notFoundException';
import { HttpStatusCode } from './httpStatusCode';

describe('NotFoundException', () => {
  it('should create an instance with the default status code and message', () => {
    const notFoundException = new NotFoundException();

    expect(notFoundException.statusCode).toBe(HttpStatusCode.NOT_FOUND);
    expect(notFoundException.message).toBe('Not Found');
    expect(notFoundException.errors).toBeUndefined();
  });

  it('should create an instance with the provided custom message', () => {
    const message = 'Custom Not Found';
    const notFoundException = new NotFoundException(message);

    expect(notFoundException.statusCode).toBe(HttpStatusCode.NOT_FOUND);
    expect(notFoundException.message).toBe(message);
    expect(notFoundException.errors).toBeUndefined();
  });
});
