import type { Context } from '@/server/context';

// Add a new event
type AddEventInput = {
  name: string;
  currency: string;
};

type AddEventParams = {
  input: AddEventInput;
  ctx: Context;
};

export const addEvent = async ({ input, ctx }: AddEventParams) => {
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
type GetCreateEventsInput = {
  take?: number;
  skip?: number;
};

type GetCreatedEventsParams = {
  input?: GetCreateEventsInput;
  ctx: Context;
};

export const getCreatedEvents = async ({
  input,
  ctx,
}: GetCreatedEventsParams) => {
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

      const take = input?.take ?? 5;
      const skip = input?.skip ?? 0;

      const events = await prisma.event.findMany({
        take,
        skip,
        where: { ownerId: owner.id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
      });
      const eventCount = await prisma.event.count();
      const isFinished = take + skip >= eventCount;

      return { success: true, events, isFinished };
    }
  }

  return { success: false };
};

// Delete event
type DeleteEventInput = {
  id: string;
};

type DeleteEventParams = {
  input: DeleteEventInput;
  ctx: Context;
};

export const deleteEvent = async ({ input, ctx }: DeleteEventParams) => {
  const { session } = ctx;

  if (session === null || prisma === undefined) {
    return { success: false, message: 'An error occurred.' };
  }

  const { user } = session;
  if (user === undefined) {
    return { success: false, message: 'You have to be authenticated first.' };
  }

  const { email } = user;
  const owner = await prisma.user.findUnique({
    where: { email: email as string },
  });

  if (!owner) {
    return { success: false, message: 'No user found.' };
  }

  const { id: eventId } = input;
  const matchingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (matchingEvent === null) {
    return { success: false, message: 'Matching event not found.' };
  }

  if (matchingEvent.ownerId !== owner.id) {
    return { success: false, message: 'You cannot delete this event.' };
  }

  await prisma.event.delete({ where: { id: matchingEvent.id } });

  return { success: true };
};
