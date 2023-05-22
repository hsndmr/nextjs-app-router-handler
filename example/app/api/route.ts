import { Handler } from 'nextjs-app-router-handler';
import { validationPipe } from 'nextjs-app-router-handler/pipes';
import { CreateCommentDto } from '@/lib/createCommentDto';
import { NextResponse } from 'next/server';
import {
  HttpException,
  HttpStatusCode,
} from 'nextjs-app-router-handler/http-exceptions';

const GET = new Handler()
  .useBeforeHandlers(() => {
    console.log('before handler');
  })
  .useMiddlewares(
    context => {
      console.log('middleware');
      if (context.searchParams().get('test')) {
        return NextResponse.json({
          message: 'test',
        });
      }
    },
    () => {
      console.log('middleware 2');
    },
  )
  .useGuards(context => {
    if (context.searchParams().get('forbidden')) {
      throw new HttpException(HttpStatusCode.FORBIDDEN, 'Forbidden');
    }
    return true;
  })
  .useAfterHandlers(() => {
    console.log('after handler');
  })
  .handle(() => {
    return {
      message: 'Hello World',
    };
  });

const POST = new Handler()
  .usePipes(validationPipe(CreateCommentDto))
  .status(HttpStatusCode.CREATED)
  .handle(context => {
    const body = context.getBody<CreateCommentDto>()!;
    return {
      comment: body.content ?? 'no comment',
    };
  });

export { GET, POST };
