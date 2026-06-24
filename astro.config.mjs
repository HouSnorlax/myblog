import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
    site: 'https://example.com',
    integrations: [mdx()],
    output: "hybrid",
    adapter: cloudflare()
});