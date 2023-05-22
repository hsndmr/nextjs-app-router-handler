## NextJs App Router Handler
DON'T USE THIS PACKAGE IN PRODUCTION. THIS PACKAGE IS IN DEVELOPMENT.

This is a simple route handler implementation for handling POST, GET, PATCH, PUT, and DELETE requests related to posts.

## Installation

```bash
npm install nextjs-app-router-handler
```

## Usage

Before using this handler, create handler function.
```typescript
// lib/createHandler.ts
import { Handler } from 'nextjs-app-router-handler';

export function createHandler() {
  const handler = new Handler();
  return handler
    .useBeforeHandlers(context => {
      const now = Date.now();
      context.set('now', now);
    })
    .useAfterHandlers(context => {
      const now = context.get<number>('now')!;
      const after = Date.now();
      console.log(`Time: ${after - now}ms`);
    });
}

```
We created this function because we can add middlewares, guards, and other things to the handler. We can use this function in all requests.




`GET` request example

```typescript

// app/api/route.ts

import { createHandler } from '@/lib/createHandler';
const GET = createHandler()
  .useMiddlewares(context => {
    const id = context.searchParams().get('id');
    if (id && Number(id) === 5) {
      return NextResponse.json({
        message: 'Post not found',
      });
    }
  })
  .handle(context => {
    // context.req is NextRequest. You can access request with this.
    
    return {
      message: 'Hello World',
    }
  });

export { GET };
```
We created a `GET` request handler. Now, we can open `http://localhost:3000/api` and see the result. If we open `http://localhost:3000/api?id=5`, we will see the result of the middleware.

`POST` request example

```typescript

import { createHandler } from '@/lib/createHandler';
import { BadRequestException, HttpStatusCode } from 'nextjs-app-router-handler';

const POST = createHandler()
  .usePipes(async context => {
    // We can validate body data with pipes.

    // we can access request with context.req
    const json = await context.req.json();

    // We can check if the JSON is valid
    if (json && !json.name) {
      // The handle method will not be called if we throw an exception.
      throw new BadRequestException('name is required');
    }

    // We can set body data with the setBody method. We will use it in the handle method.
    context.setBody(json);
  })
  .status(HttpStatusCode.CREATED)
  .handle(context => {

    // We can get body data with the getBody method.
    const body = context.getBody<{
      name: string;
    }>()!;

    return {
      name: body.name,
    };
  });

export { POST };

```
We created a `POST` request handler. Now, we can open `http://localhost:3000/api` and see the result. If we open `http://localhost:3000/api` with `POST` method and send this JSON data:
```json
{
  "name": "John Doe"
}
```
We will see the result of the handler. The response status will be 201 because we set it with the status method. If we send the following JSON data:

```json
{
}
```
We will see a bad request error because we threw an exception in the pipe method.
