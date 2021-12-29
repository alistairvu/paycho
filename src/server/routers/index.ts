import helloRouter from './hello';
import createRouter from '@/server/createRouter';

export const appRouter = createRouter.merge('hello.', helloRouter);

export type AppRouter = typeof appRouter;
