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

// Add participant to event
type AddParticipantInput = {
  eventId: string;
  addedEmail: string;
};

type AddParticipantParams = {
  input: AddParticipantInput;
  ctx: Context;
};

export const addParticipant = async ({ input }: AddParticipantParams) => {
  if (prisma === undefined) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred',
    });
  }
  const { addedEmail, eventId } = input;
  const addedUser = await prisma.user.findUnique({
    where: { email: addedEmail },
  });

  if (!addedUser) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Matching user not found',
    });
  }

  const existingParticipant = await prisma.participantsOnEvents.findFirst({
    where: {
      participantId: addedUser.id,
      eventId,
    },
  });

  if (existingParticipant) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'User is already a participant',
    });
  }

  const newUserInEvent = await prisma.participantsOnEvents.create({
    data: {
      eventId,
      participantId: addedUser.id,
    },
  });

  return { data: newUserInEvent };
};

// Get all participants in an event
