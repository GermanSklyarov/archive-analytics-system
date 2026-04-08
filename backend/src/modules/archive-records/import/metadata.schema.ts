import { z } from 'zod';

export const metadataSchema = z
  .object({
    source: z.string().optional(),
    country: z.string().optional(),
    device: z.string().optional(),
  })
  .catchall(z.unknown());
