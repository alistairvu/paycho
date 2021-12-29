import { inferProcedureOutput } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

import { appRouter, AppRouter } from '@/server/routers';
import { createContext } from '@/server/context';

export type inferQueryResponse<
  TRouteKey extends keyof AppRouter['_def']['queries']
> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
