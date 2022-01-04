import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';

type Context = {
  session: Session;
  req: NextApiRequest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: NextApiResponse<any>;
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

export const addParticipant = async ({ input, ctx }: AddParticipantParams) => {
  if (prisma === undefined) {
    return { success: false, message: 'An error occurred.' };
  }

  const { session } = ctx;
  const { user: sessionUser } = session;
  if (sessionUser === undefined) {
    return { success: false, message: 'You have to be authenticated first.' };
  }

  const { email } = sessionUser;
  const user = await prisma.user.findUnique({
    where: { email: email as string },
  });

  if (user === null) {
    return { success: false, message: 'An error occurred' };
  }

  const { addedEmail, eventId } = input;

  const checkParticipating = await prisma.participantsOnEvents.findFirst({
    where: {
      eventId,
      participantId: user.id,
    },
  });

  if (!checkParticipating) {
    return {
      success: false,
      message: 'You cannot add a participant to this event.',
    };
  }

  const addedUser = await prisma.user.findUnique({
    where: { email: addedEmail },
  });

  if (!addedUser) {
    return { success: false, message: 'User not found' };
  }

  const newUserInEvent = await prisma.participantsOnEvents.create({
    data: {
      eventId,
      participantId: addedUser.id,
    },
  });

  return { success: true, data: newUserInEvent };
};
