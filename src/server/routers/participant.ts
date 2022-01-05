import { TRPCError } from '@trpc/server';
import { object, optional, string, validate } from 'superstruct';
import { addParticipant } from '@/server/controllers/participant';
import { createRouterWithAuth } from '@/server/middleware/auth';

const inputSchema = object({
  eventId: string(),
  addedEmail: optional(string()),
});

const participantRouter = createRouterWithAuth
  // Middleware to check participant of event
  .middleware(async ({ ctx, rawInput, next }) => {
    if (prisma === undefined) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }

    const [err, inputData] = validate(rawInput, inputSchema);
    console.log(inputData);

    if (err) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You cannot perform this operation',
      });
    }

    const { eventId } = inputData;
    const checkParticipating = await prisma.participantsOnEvents.findFirst({
      where: {
        eventId,
        participantId: ctx.user.id,
      },
    });
    if (!checkParticipating) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You cannot perform this operation',
      });
    }

    return next();
  })
  // Mutation to add user to event
  .mutation('add', {
    input: object({
      eventId: string(),
      addedEmail: string(),
    }),
    resolve: async ({ input, ctx }) => addParticipant({ input, ctx }),
  });

export default participantRouter;
