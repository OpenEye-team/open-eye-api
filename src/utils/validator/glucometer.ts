import {z} from 'zod';

export const glucometerInputSchema = z.object({
  value: z.number(),
  date: z.date(),
  time: z.string(),
  meal: z.string(),
});