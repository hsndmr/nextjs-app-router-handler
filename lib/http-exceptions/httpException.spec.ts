import { HttpException } from './httpException';
import { HttpStatusCode } from './httpStatusCode';

describe('HttpException', () => {
  it('should create an instance with the provided status code and message', () => {
    const statusCode = HttpStatusCode.BAD_REQUEST;
    const message = 'Bad Request';
    const httpException = new HttpException(statusCode, message);

    expect(httpException.statusCode).toBe(statusCode);
    expect(httpException.message).toBe(message);
    expect(httpException.errors).toBeUndefined();
  });

  it('should create an instance with the provided status code, message, and errors', () => {
    const statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    const message = 'Internal Server Error';
    const errors = ['Error 1', 'Error 2'];
    const httpException = new HttpException(statusCode, message, errors);

    expect(httpException.statusCode).toBe(statusCode);
    expect(httpException.message).toBe(message);
    expect(httpException.errors).toEqual(errors);
  });
});
