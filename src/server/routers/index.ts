import helloRouter from './hello';
import eventRouter from './event';
import createRouter from '@/server/createRouter';

export const appRouter = createRouter
  .merge('hello.', helloRouter)
  .merge('event.', eventRouter);

export type AppRouter = typeof appRouter;
