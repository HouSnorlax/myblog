import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { generateOgpPng } from '../../utils/ogp';
import { SITE_TITLE } from '../../consts';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
};

type Props = {
  post: CollectionEntry<'blog'>;
};

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as Props;

  const pngBuffer = await generateOgpPng({
    title: post.data.title,
    snippet: post.data.snippet || post.data.description || '',
    siteTitle: SITE_TITLE,
    domain: 'muho.muho.workers.dev',
  });

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
