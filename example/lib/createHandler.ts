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
