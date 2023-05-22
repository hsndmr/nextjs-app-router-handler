import { createHandler } from '@/lib/createHandler';
import { DATA } from '@/lib/data';
import { NextResponse } from 'next/server';
import { validationPipe } from 'nextjs-app-router-handler/pipes';
import { CreatePostDto } from '@/lib/createPostDto';
import {
  HttpStatusCode,
  UnprocessableEntityException,
} from 'nextjs-app-router-handler';

const GET = createHandler()
  .useMiddlewares(context => {
    const id = context.searchParams().get('id');
    if (id) {
      const findPost = DATA.find(post => post.id === Number(id));
      if (!findPost) {
        return NextResponse.json({
          message: 'Post not found',
        });
      }
    }
  })
  .handle(context => {
    const id = context.req.nextUrl.searchParams.get('id');

    return DATA.filter(post => {
      return id ? post.id === Number(id) : true;
    });
  });

const POST = createHandler()
  .useMiddlewares(context => {
    console.log('context', context.req.body);
  })
  .usePipes(validationPipe(CreatePostDto))
  .status(HttpStatusCode.CREATED)
  .handle(context => {
    const createPostDto = context.getBody<CreatePostDto>()!;

    const existingPost = DATA.find(post => post.id === createPostDto.id);

    if (existingPost) {
      throw new UnprocessableEntityException('Post already exists');
    }

    const newPost = {
      title: createPostDto.title,
      category: createPostDto.category,
      id: createPostDto.id,
    };
    DATA.push(newPost);

    return newPost;
  });

export { GET, POST };
