import { TRPCError } from '@trpc/server';
import { object, string } from 'superstruct';
import createRouter from '@/server/createRouter';
import { addEvent, getCreatedEvents } from '@/server/controllers/event';

const eventRouter = createRouter
  .middleware(({ ctx, next }) => {
    const { session } = ctx;

    if (!session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next();
  })
  .mutation('add', {
    input: object({
      name: string(),
      currency: string(),
    }),

    resolve: async ({ input, ctx }) => addEvent({ input, ctx }),
  })
  .query('get-created', {
    resolve: async ({ ctx }) => getCreatedEvents(ctx),
  });

export default eventRouter;
