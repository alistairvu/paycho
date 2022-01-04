import { TRPCError } from '@trpc/server';
import { object, string, number, optional } from 'superstruct';
import createRouter from '@/server/createRouter';
import {
  addEvent,
  getCreatedEvents,
  deleteEvent,
  getEventById,
  updateEvent,
} from '@/server/controllers/event';

const eventRouter = createRouter
  .middleware(({ ctx, next }) => {
    const { session } = ctx;

    if (!session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({
      ctx: {
        ...ctx,
        session,
      },
    });
  })
  .mutation('add', {
    input: object({
      name: string(),
      currency: string(),
    }),

    resolve: async ({ input, ctx }) => addEvent({ input, ctx }),
  })
  .query('get-created', {
    input: optional(
      object({
        take: optional(number()),
        skip: optional(number()),
      })
    ),
    resolve: async ({ input, ctx }) => getCreatedEvents({ input, ctx }),
  })
  .query('delete', {
    input: object({ id: string() }),
    resolve: async ({ input, ctx }) => deleteEvent({ input, ctx }),
  })
  .query('get-by-id', {
    input: object({ id: string() }),
    resolve: async ({ input, ctx }) => getEventById({ input, ctx }),
  })
  .mutation('update', {
    input: object({ id: string(), name: string(), currency: string() }),
    resolve: async ({ input, ctx }) => updateEvent({ input, ctx }),
  });

export default eventRouter;
