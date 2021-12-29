import type { Context } from '@/server/context';

type AddEventInput = {
  name: string;
  currency: string;
};

// Add a new event
export const addEvent = async ({
  input,
  ctx,
}: {
  input: AddEventInput;
  ctx: Context;
}) => {
  const { session } = ctx;

  if (session !== null && prisma !== undefined) {
    const { user } = session;

    if (user !== undefined) {
      const { email } = user;

      const owner = await prisma.user.findUnique({
        where: { email: email as string },
      });

      if (owner === null) {
        return { success: false };
      }

      const event = await prisma.event.create({
        data: {
          ...input,
          ownerId: owner.id,
        },
      });

      return { success: true, event };
    }
  }
  return { success: false };
};

// Get all events created
export const getCreatedEvents = async (ctx: Context) => {
  const { session } = ctx;

  if (session !== null && prisma !== undefined) {
    const { user } = session;

    if (user !== undefined) {
      const { email } = user;

      const owner = await prisma.user.findUnique({
        where: { email: email as string },
      });

      if (owner === null) {
        return { success: false };
      }

      const events = await prisma.event.findMany({
        take: 5,
        where: { ownerId: owner.id },
      });

      return { success: true, events };
    }
  }

  return { success: false };
};
