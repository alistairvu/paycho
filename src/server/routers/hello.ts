import { object, optional, string } from 'superstruct';
import createRouter from '@/server/createRouter';

const helloRouter = createRouter.query('get', {
  input: optional(
    object({
      text: optional(string()),
    })
  ),
  resolve({ input }) {
    return {
      greeting: `hello ${input?.text ?? 'world'}`,
    };
  },
});

export default helloRouter;
