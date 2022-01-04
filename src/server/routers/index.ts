import helloRouter from './hello';
import eventRouter from './event';
import participantRouter from './participant';
import createRouter from '@/server/createRouter';

export const appRouter = createRouter
  .merge('hello.', helloRouter)
  .merge('event.', eventRouter)
  .merge('participant.', participantRouter);

export type AppRouter = typeof appRouter;
