import { NextRequest, NextResponse } from 'next/server';
import { Context } from './context';
import { HttpException, HttpStatusCode } from './http-exceptions';

export type ContextHandler<C, R> = (context: C) => R | Promise<R>;

export class Handler<C extends Context> {
  private middlewares: ContextHandler<C, unknown>[] = [];

  private pipes: ContextHandler<C, void>[] = [];

  private guards: ContextHandler<C, boolean>[] = [];

  private beforeHandlers: ContextHandler<C, unknown>[] = [];

  private afterHandlers: ContextHandler<C, unknown>[] = [];

  private beforeErrorHandlers: ((context: C, e: unknown) => unknown)[] = [];

  private returnJson = true;

  private statusCode: HttpStatusCode = HttpStatusCode.OK;

  constructor() {}

  status(statusCode: HttpStatusCode) {
    this.statusCode = statusCode;
    return this;
  }

  isReturnJson(isReturnJson: boolean) {
    this.returnJson = isReturnJson;
    return this;
  }

  useMiddlewares(...middlewares: ContextHandler<C, unknown>[]) {
    this.middlewares.push(...middlewares);
    return this;
  }

  handle(handler: ContextHandler<C, unknown>) {
    return async (request: NextRequest) => {
      const context = new Context(request) as C;
      try {
        await this.executeBeforeHandlers(context);

        for (const middleware of this.middlewares) {
          let resultMiddleware = middleware.call(this, context);

          if (resultMiddleware instanceof Promise) {
            resultMiddleware = await resultMiddleware;
          }

          if (resultMiddleware) {
            return resultMiddleware;
          }
        }

        for (const guard of this.guards) {
          let resultGuard = guard.call(this, context);

          if (resultGuard instanceof Promise) {
            resultGuard = await resultGuard;
          }

          if (!resultGuard) {
            return NextResponse.json(
              {},
              {
                status: HttpStatusCode.FORBIDDEN,
              },
            );
          }
        }

        await this.executePipes(context);

        let result = handler.call(this, context);

        if (result instanceof Promise) {
          result = await result;
        }

        await this.executeAfterHandlers(context);

        if (this.returnJson) {
          return NextResponse.json(result, {
            status: this.statusCode,
          });
        }

        return result;
      } catch (e: unknown) {
        return this.handleError(e, context);
      }
    };
  }

  usePipes(...pipes: ContextHandler<C, void>[]) {
    this.pipes.push(...pipes);
    return this;
  }

  useGuards(...guards: ContextHandler<C, boolean>[]) {
    this.guards.push(...guards);
    return this;
  }

  useBeforeHandlers(...handlers: ContextHandler<C, unknown>[]) {
    this.beforeHandlers.push(...handlers);
    return this;
  }

  useAfterHandlers(...handlers: ContextHandler<C, unknown>[]) {
    this.afterHandlers.push(...handlers);
    return this;
  }

  useBeforeErrorHandlers(...handlers: ((context: C, e: unknown) => unknown)[]) {
    this.beforeErrorHandlers.push(...handlers);
    return this;
  }

  async handleError(e: unknown, context: C) {
    await this.executeBeforeErrorHandlers(e, context);
    let errors = undefined;
    const response = {
      message: 'Internal Server Error',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    };

    if (e instanceof HttpException) {
      response.message = e.message;
      response.statusCode = e.statusCode;
      errors = e.errors;
    } else if (e instanceof Error) {
      response.message = e.message;
    }

    return NextResponse.json(
      {
        message: response.message,
        errors,
      },
      {
        status: response.statusCode,
      },
    );
  }

  async executeBeforeHandlers(context: C) {
    if (!this.beforeHandlers.length) {
      return;
    }

    for (const handler of this.beforeHandlers) {
      const resultBeforeHandler = handler.call(this, context);

      if (resultBeforeHandler instanceof Promise) {
        await resultBeforeHandler;
      }
    }
  }

  async executeAfterHandlers(context: C) {
    if (!this.afterHandlers.length) {
      return;
    }

    for (const handler of this.afterHandlers) {
      const resultAfterHandler = handler.call(this, context);

      if (resultAfterHandler instanceof Promise) {
        await resultAfterHandler;
      }
    }
  }

  async executeBeforeErrorHandlers(e: unknown, context: C) {
    if (!this.beforeErrorHandlers.length) {
      return;
    }

    for (const handler of this.beforeErrorHandlers) {
      const resultBeforeErrorHandler = handler.call(this, context, e);

      if (resultBeforeErrorHandler instanceof Promise) {
        await resultBeforeErrorHandler;
      }
    }
  }

  async executePipes(context: C) {
    for (const pipe of this.pipes) {
      const resultPipe = pipe.call(this, context);

      if (resultPipe instanceof Promise) {
        await resultPipe;
      }
    }
  }
}
