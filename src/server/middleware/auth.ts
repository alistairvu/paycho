import { TRPCError } from '@trpc/server';
import createRouter from '@/server/createRouter';

export const createRouterWithAuth = createRouter.middleware(
  async ({ ctx, next }) => {
    if (prisma === undefined) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }

    const { session } = ctx;
    if (!session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const { user: sessionUser } = session;
    if (sessionUser === undefined || prisma === undefined) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const { email } = sessionUser;
    const user = await prisma.user.findUnique({
      where: { email: email as string },
    });
    if (user === null) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You cannot perform this operation',
      });
    }

    return next({
      ctx: {
        ...ctx,
        session,
        user,
      },
    });
  }
);
