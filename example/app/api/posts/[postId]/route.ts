import { createHandler } from '@/lib/createHandler';
import { validationPipe } from 'nextjs-app-router-handler/pipes';
import { UpdatePostDto } from '@/lib/updatePostDto';
import { DATA } from '@/lib/data';
import { NotFoundException } from 'nextjs-app-router-handler';

const PATCH = createHandler()
  .usePipes(validationPipe(UpdatePostDto))
  .handle(context => {
    const { postId } = context.getParams<{
      postId: string;
    }>()!;
    const post = DATA.find(post => post.id === Number(postId));

    if (!post) {
      throw new NotFoundException();
    }

    const updatePostDto = context.getBody<UpdatePostDto>()!;

    const newPost = {
      ...post,
      ...updatePostDto,
    };

    DATA[DATA.indexOf(post)] = newPost;

    return newPost;
  });

const DELETE = createHandler().handle(context => {
  const { postId } = context.getParams<{
    postId: string;
  }>()!;
  const post = DATA.find(post => post.id === Number(postId));

  if (!post) {
    throw new NotFoundException();
  }

  DATA.splice(DATA.indexOf(post), 1);

  return {};
});

export { PATCH, DELETE };
