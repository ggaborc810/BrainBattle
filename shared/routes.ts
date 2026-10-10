import { z } from 'zod';
import { insertUserSchema, users, characters, questions } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  // --- Users ---
  users: {
    get: {
      method: 'GET' as const,
      path: '/api/users/:username',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/users',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        200: z.custom<typeof users.$inferSelect>(), // Return existing user if found
        400: errorSchemas.validation,
      },
    },
    updatePoints: {
      method: 'PATCH' as const,
      path: '/api/users/:username/points',
      input: z.object({ points: z.number() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    unlockCharacter: {
      method: 'POST' as const,
      path: '/api/users/:username/unlock',
      input: z.object({ characterId: z.number() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: z.object({ message: z.string() }), // Not enough points or already unlocked
        404: errorSchemas.notFound,
      },
    },
  },

  // --- Characters ---
  characters: {
    list: {
      method: 'GET' as const,
      path: '/api/characters',
      responses: {
        200: z.array(z.custom<typeof characters.$inferSelect>()),
      },
    },
  },

  // --- Questions ---
  questions: {
    list: {
      method: 'GET' as const,
      path: '/api/questions',
      responses: {
        200: z.array(z.custom<typeof questions.$inferSelect>()),
      },
    },
  },
};

// ============================================
// HELPER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
