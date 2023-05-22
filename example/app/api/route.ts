import { Handler } from 'nextjs-app-router-handler';
import { validationPipe } from 'nextjs-app-router-handler/pipes';
import { CreateCommentDto } from '@/lib/createCommentDto';

const GET = new Handler().handle(context => {
  return {
    message: 'Hello World',
  };
});

const POST = new Handler()
  .usePipes(validationPipe(CreateCommentDto))
  .handle(context => {
    const body = context.getBody<CreateCommentDto>()!;
    return {
      comment: body.content ?? 'no comment',
    };
  });

export { GET, POST };
