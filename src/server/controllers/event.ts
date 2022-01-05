import { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';

type Context = {
  session: Session;
  req: NextApiRequest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: NextApiResponse<any>;
  user: User;
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
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred',
    });
  }

  const { user } = ctx;

  const event = await prisma.event.create({
    data: {
      ...input,
      ownerId: user.id,
      participants: {
        create: [{ participant: { connect: { id: user.id } } }],
      },
    },
  });

  return { event };
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
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred',
    });
  }

  const { user } = ctx;

  const take = input?.take ?? 5;
  const skip = input?.skip ?? 0;

  const events = await prisma.event.findMany({
    take,
    skip,
    where: { ownerId: user.id },
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

  return { events, isFinished };
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
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred',
    });
  }

  const { user } = ctx;
  const { id: eventId } = input;

  const checkParticipating = await prisma.participantsOnEvents.findFirst({
    where: {
      participantId: user.id,
      eventId,
    },
  });

  if (checkParticipating === null) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You cannot view this event',
    });
  }

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
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No matching events found',
    });
  }

  return { event: matchingEvent };
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
  if (prisma === undefined) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred',
    });
  }

  const { user } = ctx;
  const { id: eventId, name, currency } = input;
  const matchingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (matchingEvent === null) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No matching events found',
    });
  }

  if (matchingEvent.ownerId !== user.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You cannot edit this event',
    });
  }

  const updated = await prisma.event.update({
    where: { id: matchingEvent.id },
    data: { name, currency },
  });

  return { event: updated };
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
  if (prisma === undefined) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred',
    });
  }

  const { user } = ctx;
  const { id: eventId } = input;
  const matchingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (matchingEvent === null) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No matching events found',
    });
  }

  if (matchingEvent.ownerId !== user.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You cannot delete this event',
    });
  }

  await prisma.event.delete({ where: { id: matchingEvent.id } });

  return { success: true };
};
