import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string().optional(),
		snippet: z.string().optional(),
		// Transform string to Date object
		pubDate: z.coerce.date().optional(),
		published_at: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
		tag: z.array(z.string()).optional(),
	}),
});

export const collections = { blog };
