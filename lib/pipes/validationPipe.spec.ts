import { IsEmail, IsNotEmpty } from 'class-validator';
import { validationPipe } from './validationPipe';
import { HttpStatusCode } from '../http-exceptions';

class Dto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}

describe('validationPipe', () => {
  it('should validate and set the validated body in the context', async () => {
    // Arrange
    const setBodyMock = jest.fn();

    const contextMock = {
      req: {
        json: () =>
          Promise.resolve({
            email: 'test@example.com',
            name: 'John Doe',
          }),
      },
      setBody: setBodyMock,
    };

    // Act
    await validationPipe(Dto)(contextMock as any);

    // Assert
    expect(setBodyMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'John Doe',
    });
  });

  it('should throw bad request exception if validation fails', () => {
    // Arrange
    const contextMock = {
      req: {
        json: () => Promise.resolve({}),
      },
    };

    // Act & Assert
    expect(validationPipe(Dto)(contextMock as any)).rejects.toMatchObject({
      statusCode: HttpStatusCode.BAD_REQUEST,
      message: 'email must be an email',
      errors: [
        'email must be an email',
        'email should not be empty',
        'name should not be empty',
      ],
    });
  });

  it('should handle empty request body', async () => {
    const contextMock = {
      req: {
        json: () => Promise.resolve(null),
      },
    };

    expect(validationPipe(Dto)(contextMock as any)).rejects.toMatchObject({
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });

  it('should handle undefined request body', async () => {
    const contextMock = {
      req: {
        json: () => Promise.resolve(undefined),
      },
    };

    expect(validationPipe(Dto)(contextMock as any)).rejects.toMatchObject({
      statusCode: HttpStatusCode.BAD_REQUEST,
    });
  });
});
