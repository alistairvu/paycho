import { TRPCError } from '@trpc/server';
import { object, string } from 'superstruct';
import createRouter from '@/server/createRouter';
import { addParticipant } from '@/server/controllers/participant';

const participantRouter = createRouter
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
      eventId: string(),
      addedEmail: string(),
    }),
    resolve: async ({ input, ctx }) => addParticipant({ input, ctx }),
  });

export default participantRouter;
