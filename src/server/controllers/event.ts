import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';

type Context = {
  session: Session;
  req: NextApiRequest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: NextApiResponse<any>;
};

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
  if (prisma === undefined) {
    return { success: false, message: 'An error occurred.' };
  }

  const { session } = ctx;
  const { user } = session;
  if (user === undefined) {
    return { success: false, message: 'You have to be authenticated first.' };
  }

  const { email } = user;
  const owner = await prisma.user.findUnique({
    where: { email: email as string },
  });

  if (owner === null) {
    return { success: false, message: 'An error occurred' };
  }

  const event = await prisma.event.create({
    data: {
      ...input,
      ownerId: owner.id,
      participants: {
        create: [{ participant: { connect: { id: owner.id } } }],
      },
    },
  });

  return { success: true, event };
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
  if (prisma === undefined) {
    return { success: false, message: 'An error occurred.' };
  }

  const { session } = ctx;
  const { user } = session;
  if (user === undefined) {
    return { success: false, message: 'You have to be authenticated first.' };
  }

  const { email } = user;
  const owner = await prisma.user.findUnique({
    where: { email: email as string },
  });
  if (owner === null) {
    return { success: false, message: 'User not found' };
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
};

// Get event by id
type GetByIdInput = {
  id: string;
};

type GetByIdParams = {
  input: GetByIdInput;
  ctx: Context;
};

export const getEventById = async ({ input, ctx }: GetByIdParams) => {
  if (prisma === undefined) {
    return { success: false, message: 'An error occurred.' };
  }

  const { session } = ctx;
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
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      participants: {
        where: {
          eventId,
        },
        include: {
          participant: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: [{ joinedAt: 'asc' }],
        take: 5,
        skip: 0,
      },
    },
  });

  if (matchingEvent === null) {
    return { success: false, message: 'Matching event not found.' };
  }

  if (matchingEvent.ownerId !== owner.id) {
    return { success: false, message: 'You cannot access this event.' };
  }

  return { success: true, event: matchingEvent };
};

// Update event
type UpdateEventInput = {
  id: string;
  name: string;
  currency: string;
};

type UpdateEventParams = {
  input: UpdateEventInput;
  ctx: Context;
};

export const updateEvent = async ({ input, ctx }: UpdateEventParams) => {
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

  const { id: eventId, name, currency } = input;
  const matchingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (matchingEvent === null) {
    return { success: false, message: 'Matching event not found.' };
  }

  if (matchingEvent.ownerId !== owner.id) {
    return { success: false, message: 'You cannot update this event.' };
  }

  console.log({ name, currency });

  const updated = await prisma.event.updateMany({
    where: { id: matchingEvent.id },
    data: { name, currency },
  });

  console.log(updated);

  return { success: true, event: matchingEvent };
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
