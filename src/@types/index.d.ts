import { Event, Owner } from '@prisma/client';

export type EventWithOwner = Event & { owner: Owner };
