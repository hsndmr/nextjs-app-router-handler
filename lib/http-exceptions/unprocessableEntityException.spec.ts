import { UnprocessableEntityException } from './unprocessableEntityException';
import { HttpStatusCode } from './httpStatusCode';

describe('UnprocessableEntityException', () => {
  it('should create an instance with the default status code and message', () => {
    const unprocessableEntityException = new UnprocessableEntityException();

    expect(unprocessableEntityException.statusCode).toBe(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
    );
    expect(unprocessableEntityException.message).toBe('Unprocessable Entity');
    expect(unprocessableEntityException.errors).toBeUndefined();
  });

  it('should create an instance with the provided custom message', () => {
    const message = 'Custom Unprocessable Entity';
    const unprocessableEntityException = new UnprocessableEntityException(
      message,
    );

    expect(unprocessableEntityException.statusCode).toBe(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
    );
    expect(unprocessableEntityException.message).toBe(message);
    expect(unprocessableEntityException.errors).toBeUndefined();
  });
});
