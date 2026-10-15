import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const products = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    version: z.string(),
    updated: z.coerce.date(),
    platforms: z.array(z.string()),
    size: z.string(),
    license: z.string(),
    repo: z.string().url().optional(),
    status: z.enum(['stable', 'beta', 'soon']),
    featured: z.boolean().default(false),
    kind: z.enum(['app', 'library', 'toolkit']).default('app'),
    icon: z.string().optional(),
    screenshots: z.array(z.string()).default([]),
  }),
});

export const collections = { products };
