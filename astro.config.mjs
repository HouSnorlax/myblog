import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import cloudflare from "@astrojs/cloudflare";

function remarkBracketRuby() {
	return (tree) => {
		function visit(node) {
			if (!node || typeof node !== 'object') return;
			if (Array.isArray(node.children)) {
				const newChildren = [];
				for (const child of node.children) {
					if (child.type === 'text' && child.value) {
						const regex = /\[([^\]]+)\]\{([^}]+)\}/g;
						if (regex.test(child.value)) {
							let lastIndex = 0;
							let match;
							regex.lastIndex = 0;
							while ((match = regex.exec(child.value)) !== null) {
								if (match.index > lastIndex) {
									newChildren.push({
										type: 'text',
										value: child.value.slice(lastIndex, match.index),
									});
								}
								newChildren.push({
									type: 'html',
									value: `<ruby>${match[1]}<rt>${match[2]}</rt></ruby>`,
								});
								lastIndex = regex.lastIndex;
							}
							if (lastIndex < child.value.length) {
								newChildren.push({
									type: 'text',
									value: child.value.slice(lastIndex),
								});
							}
						} else {
							newChildren.push(child);
						}
					} else {
						visit(child);
						newChildren.push(child);
					}
				}
				node.children = newChildren;
			}
		}
		visit(tree);
	};
}

// https://astro.build/config
export default defineConfig({
    site: 'https://muho.muho.workers.dev',

    markdown: {
		remarkPlugins: [remarkBracketRuby],
	},

    integrations: [
		mdx({
			remarkPlugins: [remarkBracketRuby],
		}),
	],

    output: "hybrid",
    adapter: cloudflare()
});