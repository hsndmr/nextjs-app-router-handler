import { Handler } from './handler';
import { BadRequestException, HttpStatusCode } from './http-exceptions';
import { NextResponse } from 'next/server';
import { Context } from './context';

const createHandler = () => {
  return new Handler();
};

describe('Handler', () => {
  describe('statusCode', () => {
    it('should set the status code correctly', () => {
      // Arrange
      const handler = createHandler();
      const statusCode = HttpStatusCode.FORBIDDEN;

      // Act
      handler.status(statusCode);

      // Assert
      expect(handler['statusCode']).toBe(statusCode);
    });
  });

  describe('isReturnJson', () => {
    it('should set the isReturnJson flag correctly', () => {
      // Arrange
      const handler = createHandler();
      const isReturnJson = false;

      // Act
      handler.isReturnJson(isReturnJson);

      // Assert
      expect(handler['returnJson']).toBe(isReturnJson);
    });
  });

  describe('useMiddlewares', () => {
    it('should add middlewares correctly', () => {
      // Arrange
      const handler = createHandler();
      const middleware1 = jest.fn();
      const middleware2 = jest.fn();

      // Act
      handler.useMiddlewares(middleware1, middleware2);

      // Assert
      expect(handler['middlewares']).toEqual([middleware1, middleware2]);
    });
  });

  describe('usePipes', () => {
    it('should add pipes correctly', () => {
      // Arrange
      const handler = createHandler();
      const pipe1 = jest.fn();
      const pipe2 = jest.fn();

      // Act
      handler.usePipes(pipe1, pipe2);

      // Assert
      expect(handler['pipes']).toEqual([pipe1, pipe2]);
    });
  });

  describe('useGuards', () => {
    it('should add guards correctly', () => {
      // Arrange
      const handler = createHandler();
      const guard1 = jest.fn();
      const guard2 = jest.fn();

      // Act
      handler.useGuards(guard1, guard2);

      // Assert
      expect(handler['guards']).toEqual([guard1, guard2]);
    });
  });

  describe('useBeforeHandlers', () => {
    it('should add before handlers correctly', () => {
      // Arrange
      const handler = createHandler();
      const beforeHandler1 = jest.fn();
      const beforeHandler2 = jest.fn();

      // Act
      handler.useBeforeHandlers(beforeHandler1, beforeHandler2);

      // Assert
      expect(handler['beforeHandlers']).toEqual([
        beforeHandler1,
        beforeHandler2,
      ]);
    });
  });

  describe('useAfterHandlers', () => {
    it('should add after handlers correctly', () => {
      // Arrange
      const handler = createHandler();
      const afterHandler1 = jest.fn();
      const afterHandler2 = jest.fn();

      // Act
      handler.useAfterHandlers(afterHandler1, afterHandler2);

      // Assert
      expect(handler['afterHandlers']).toEqual([afterHandler1, afterHandler2]);
    });
  });

  describe('useBeforeErrorHandlers', () => {
    it('should add before error handlers correctly', () => {
      // Arrange
      const handler = createHandler();

      const beforeErrorHandler1 = jest.fn();
      const beforeErrorHandler2 = jest.fn();

      // Act
      handler.useBeforeErrorHandlers(beforeErrorHandler1, beforeErrorHandler2);

      // Assert
      expect(handler['beforeErrorHandlers']).toEqual([
        beforeErrorHandler1,
        beforeErrorHandler2,
      ]);
    });
  });

  describe('handleError', () => {
    it('should handle errors correctly', async () => {
      // Arrange

      const handler = createHandler();
      const error = new Error('Test error');
      (NextResponse.json as jest.Mock).mockReturnValue({
        message: error.message,
      });

      // Act
      const nextResponse = await handler.handleError(error, jest.fn() as any);

      // Assert
      expect(nextResponse).toEqual(
        expect.objectContaining({
          message: error.message,
        }),
      );
      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          message: error.message,
        },
        {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        },
      );
    });

    it('should handle a http error correctly', async () => {
      // Arrange

      const handler = createHandler();
      const error = new BadRequestException('Test error', ['error']);

      (NextResponse.json as jest.Mock).mockReturnValue({
        message: 'Test error',
        errors: ['error'],
      });

      // Act
      const nextResponse = await handler.handleError(error, jest.fn() as any);

      // Assert
      expect(nextResponse).toEqual(
        expect.objectContaining({
          message: 'Test error',
          errors: ['error'],
        }),
      );
      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          message: error.message,
          errors: ['error'],
        },
        {
          status: HttpStatusCode.BAD_REQUEST,
        },
      );
    });
  });

  describe('executeBeforeHandlers', () => {
    it('should execute before handlers correctly', async () => {
      // Arrange
      const handler = createHandler();
      const beforeHandler1 = jest.fn();
      const beforeHandler2 = jest.fn(() => Promise.resolve());
      const context = jest.fn();
      handler.useBeforeHandlers(beforeHandler1, beforeHandler2);

      // Act
      await handler.executeBeforeHandlers(context as any);

      // Assert
      expect(beforeHandler1).toHaveBeenCalledWith(context);
      expect(beforeHandler2).toHaveBeenCalledWith(context);
    });
  });

  describe('executeAfterHandlers', () => {
    it('should execute after handlers correctly', async () => {
      // Arrange
      const handler = createHandler();
      const afterHandler1 = jest.fn();
      const afterHandler2 = jest.fn(() => Promise.resolve());
      handler.useAfterHandlers(afterHandler1, afterHandler2);
      const context = jest.fn();
      const response = jest.fn();

      // Act
      await handler.executeAfterHandlers(context as any, response as any);

      // Assert
      expect(afterHandler1).toHaveBeenCalledWith(context, response);
      expect(afterHandler2).toHaveBeenCalledWith(context, response);
    });
  });

  describe('executeBeforeErrorHandlers', () => {
    it('should execute before error handlers correctly', async () => {
      // Arrange
      const handler = createHandler();
      const error = new Error('Test error');
      const beforeErrorHandler1 = jest.fn();
      const beforeErrorHandler2 = jest.fn(() => Promise.resolve());
      handler.useBeforeErrorHandlers(beforeErrorHandler1, beforeErrorHandler2);
      const context = jest.fn();

      // Act
      await handler.executeBeforeErrorHandlers(error, context as any);

      // Assert
      expect(beforeErrorHandler1).toHaveBeenCalledWith(context, error);
      expect(beforeErrorHandler2).toHaveBeenCalledWith(context, error);
    });
  });

  describe('executePipes', () => {
    it('should execute pipes correctly', async () => {
      // Arrange
      const handler = createHandler();
      const pipe1 = jest.fn();
      const pipe2 = jest.fn(() => Promise.resolve());
      handler.usePipes(pipe1, pipe2);
      const context = jest.fn();

      // Act
      await handler.executePipes(context as any);

      // Assert
      expect(pipe1).toHaveBeenCalledWith(context);
      expect(pipe2).toHaveBeenCalledWith(context);
    });
  });

  describe('handle', () => {
    it('should handle the request correctly', async () => {
      // Arrange
      const req = jest.fn();
      const reqContext = jest.fn();
      const context = new Context(req as any, reqContext as any);
      const middleware1 = jest.fn();
      const middleware2 = jest.fn(() => Promise.resolve());
      const guard1 = jest.fn().mockReturnValue(true);
      const guard2 = jest.fn(() => Promise.resolve(true));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const handlerFunction = jest.fn(_ => Promise.resolve());

      const handler = new Handler()
        .useMiddlewares(middleware1, middleware2)
        .useGuards(guard1, guard2)
        .status(HttpStatusCode.OK);

      (NextResponse.json as jest.Mock).mockReturnValue({
        message: 'Test',
      });

      jest.spyOn(handler, 'executeBeforeHandlers').mockResolvedValue(undefined);
      jest.spyOn(handler, 'executeAfterHandlers').mockResolvedValue(undefined);
      jest.spyOn(handler, 'executePipes').mockResolvedValue(undefined);
      jest.spyOn(handler, 'handleError').mockResolvedValue(NextResponse as any);

      // Act
      const response = await handler.handle(async context => {
        await handlerFunction(context);
        return {
          message: 'Test',
        };
      })(req as any, reqContext);

      // Assert
      expect(handler.executeBeforeHandlers).toHaveBeenCalledWith(context);
      expect(middleware1).toHaveBeenCalledWith(context);
      expect(middleware2).toHaveBeenCalledWith(context);
      expect(guard1).toHaveBeenCalledWith(context);
      expect(guard2).toHaveBeenCalledWith(context);
      expect(handler.executePipes).toHaveBeenCalledWith(context);
      expect(handlerFunction).toHaveBeenCalledWith(context);
      expect(handler.executeAfterHandlers).toHaveBeenCalledWith(context, {
        message: 'Test',
      });
      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          message: 'Test',
        },
        {
          status: HttpStatusCode.OK,
        },
      );
      expect(response).toEqual({
        message: 'Test',
      });
      expect(handler.handleError).not.toHaveBeenCalled();
    });

    it('should handle the request correctly when an error is thrown by beforeHandlers', async () => {
      const req = jest.fn();
      const reqContext = jest.fn();
      const context = new Context(req as any, reqContext as any);
      const beforeHandler1 = jest.fn();
      const beforeHandler2 = jest.fn(() => Promise.reject('error'));

      const handler = new Handler()
        .useBeforeHandlers(beforeHandler1, beforeHandler2)
        .status(HttpStatusCode.OK);
      jest.spyOn(handler, 'handleError').mockResolvedValue(NextResponse as any);

      // Act

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await handler.handle(() => {})(req as any, reqContext);

      expect(handler.handleError).toHaveBeenCalledWith('error', context);
    });

    it('should handle the request correctly when an error is thrown by middlewares', async () => {
      const req = jest.fn();
      const reqContext = jest.fn();
      const context = new Context(req as any, reqContext as any);
      const beforeHandler = jest.fn();
      const middleware1 = jest.fn();
      const middleware2 = jest.fn(() => Promise.reject('error'));

      const handler = new Handler()
        .useBeforeHandlers(beforeHandler)
        .useMiddlewares(middleware1, middleware2);

      jest.spyOn(handler, 'handleError').mockResolvedValue(NextResponse as any);

      // Act
      await handler.handle(jest.fn())(req as any, reqContext);

      expect(beforeHandler).toHaveBeenCalledWith(context);
      expect(handler.handleError).toHaveBeenCalledWith('error', context);
    });

    it('should handle the request correctly when a guard returns false', async () => {
      const req = jest.fn();
      const reqContext = jest.fn();
      const context = new Context(req as any, reqContext as any);
      const beforeHandler = jest.fn();
      const middleware = jest.fn();
      const guard1 = jest.fn().mockReturnValue(true);
      const guard2 = jest.fn().mockReturnValue(false);

      const handler = new Handler()
        .useBeforeHandlers(beforeHandler)
        .useMiddlewares(middleware)
        .useGuards(guard1, guard2);

      jest.spyOn(handler, 'handleError').mockResolvedValue(NextResponse as any);

      // Act
      await handler.handle(jest.fn())(req as any, reqContext);

      expect(beforeHandler).toHaveBeenCalledWith(context);
      expect(middleware).toHaveBeenCalledWith(context);
      expect(guard1).toHaveBeenCalledWith(context);
      expect(NextResponse.json).toHaveBeenCalledWith(
        {},
        {
          status: HttpStatusCode.FORBIDDEN,
        },
      );
    });

    it('should handle the request correctly when an error is thrown by guards', async () => {
      const req = jest.fn();
      const reqContext = jest.fn();
      const context = new Context(req as any, reqContext as any);
      const beforeHandler = jest.fn();
      const middleware = jest.fn();
      const guard1 = jest.fn().mockReturnValue(true);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const guard2Handler = jest.fn(_ => Promise.reject('error'));
      const guard2 = async (context: any) => {
        await guard2Handler(context);
        return true;
      };

      const handler = new Handler()
        .useBeforeHandlers(beforeHandler)
        .useMiddlewares(middleware)
        .useGuards(guard1, guard2);

      jest.spyOn(handler, 'handleError').mockResolvedValue(NextResponse as any);

      // Act
      await handler.handle(jest.fn())(req as any, reqContext);

      expect(beforeHandler).toHaveBeenCalledWith(context);
      expect(middleware).toHaveBeenCalledWith(context);
      expect(guard1).toHaveBeenCalledWith(context);
      expect(handler.handleError).toHaveBeenCalledWith('error', context);
    });

    it('should handle the request correctly when an error is thrown by pipes', async () => {
      const req = jest.fn();
      const reqContext = jest.fn();
      const context = new Context(req as any, reqContext as any);
      const beforeHandler = jest.fn();
      const middleware = jest.fn();
      const guard = jest.fn().mockReturnValue(true);
      const pipe1 = jest.fn();
      const pipe2 = jest.fn(() => Promise.reject('error'));

      const handler = new Handler()
        .useBeforeHandlers(beforeHandler)
        .useMiddlewares(middleware)
        .usePipes(pipe1, pipe2)
        .useGuards(guard);

      jest.spyOn(handler, 'handleError').mockResolvedValue(NextResponse as any);

      // Act
      await handler.handle(jest.fn())(req as any, reqContext);

      expect(beforeHandler).toHaveBeenCalledWith(context);
      expect(middleware).toHaveBeenCalledWith(context);
      expect(guard).toHaveBeenCalledWith(context);
      expect(handler.handleError).toHaveBeenCalledWith('error', context);
    });

    it('should handle the request correctly when an error is thrown by handler', async () => {
      const req = jest.fn();
      const reqContext = jest.fn();
      const context = new Context(req as any, reqContext as any);
      const beforeHandler = jest.fn();
      const middleware = jest.fn();
      const guard = jest.fn().mockReturnValue(true);
      const pipe = jest.fn();
      const handlerFunction = jest.fn(() => Promise.reject('error'));

      const handler = new Handler()
        .useBeforeHandlers(beforeHandler)
        .useMiddlewares(middleware)
        .usePipes(pipe)
        .useGuards(guard);

      jest.spyOn(handler, 'handleError').mockResolvedValue(NextResponse as any);

      // Act
      await handler.handle(handlerFunction)(req as any, reqContext);

      expect(beforeHandler).toHaveBeenCalledWith(context);
      expect(middleware).toHaveBeenCalledWith(context);
      expect(guard).toHaveBeenCalledWith(context);
      expect(pipe).toHaveBeenCalledWith(context);
      expect(handler.handleError).toHaveBeenCalledWith('error', context);
    });

    it('should handle the request correctly when an error is thrown by afterHandler', async () => {
      const req = jest.fn();
      const reqContext = jest.fn();
      const context = new Context(req as any, reqContext as any);
      const beforeHandler = jest.fn();
      const middleware = jest.fn();
      const guard = jest.fn().mockReturnValue(true);
      const pipe = jest.fn();
      const handlerFunction = jest.fn();
      const afterHandler = jest.fn(() => Promise.reject('error'));

      const handler = new Handler()
        .useBeforeHandlers(beforeHandler)
        .useMiddlewares(middleware)
        .usePipes(pipe)
        .useAfterHandlers(afterHandler)
        .useGuards(guard);

      jest.spyOn(handler, 'handleError').mockResolvedValue(NextResponse as any);

      // Act
      await handler.handle(handlerFunction)(req as any, reqContext);

      expect(beforeHandler).toHaveBeenCalledWith(context);
      expect(middleware).toHaveBeenCalledWith(context);
      expect(guard).toHaveBeenCalledWith(context);
      expect(pipe).toHaveBeenCalledWith(context);
      expect(handlerFunction).toHaveBeenCalledWith(context);
      expect(handler.handleError).toHaveBeenCalledWith('error', context);
    });

    it('should handle the request correctly when isRequestJson is set to false', async () => {
      const req = jest.fn();
      const reqContext = jest.fn();
      const handlerFunction = () => {
        return NextResponse.json({
          data: 'data',
        });
      };

      const handler = new Handler().isReturnJson(false);

      // Act
      await handler.handle(handlerFunction)(req as any, reqContext);

      expect(NextResponse.json).toHaveBeenCalledWith({
        data: 'data',
      });
    });

    it('should handle the request correctly when a middleware returns a value', async () => {
      const req = jest.fn();
      const reqContext = jest.fn();
      const middleware = () => {
        return NextResponse.json({
          data: 'data',
        });
      };

      const handler = new Handler()
        .isReturnJson(false)
        .useMiddlewares(middleware);

      // Act
      await handler.handle(jest.fn())(req as any, reqContext);

      expect(NextResponse.json).toHaveBeenCalledWith({
        data: 'data',
      });
    });
  });
});
