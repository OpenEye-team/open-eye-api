import {z} from 'zod';

export const articleInputSchema = z.object({
  title: z.string(),
  content: z.string(),
});
