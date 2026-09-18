import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { renderNoteMinimalC1 } from './ogp_templates_c.mjs';

const blogDir = path.resolve('src/content/blog');
const publicOgDir = path.resolve('public/og');
const iconPath = path.resolve('public/13.png');

if (!fs.existsSync(publicOgDir)) {
  fs.mkdirSync(publicOgDir, { recursive: true });
}

const iconBuffer = fs.existsSync(iconPath) ? fs.readFileSync(iconPath) : null;
const iconBase64 = iconBuffer ? iconBuffer.toString('base64') : '';

function parseArticle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const fm = match[1];

  const titleMatch = fm.match(/title:\s*(.*)/);
  const snippetMatch = fm.match(/(?:snippet|description):\s*["']?(.*?)["']?$/m);

  const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, '') : '';
  const snippet = snippetMatch ? snippetMatch[1].trim().replace(/^["']|["']$/g, '') : '';

  return { title, snippet };
}

async function main() {
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  console.log(`Found ${files.length} articles in ${blogDir}`);

  for (const file of files) {
    const slug = file.replace(/\.mdx?$/, '');
    const filePath = path.join(blogDir, file);
    const data = parseArticle(filePath);
    if (!data) {
      console.warn(`Skipping ${file}: invalid frontmatter`);
      continue;
    }

    const svg = renderNoteMinimalC1({
      title: data.title,
      snippet: data.snippet,
      siteTitle: 'MUHOのブログ',
      domain: 'muho.muho.workers.dev',
      iconBase64,
    });

    const outputPath = path.join(publicOgDir, `${slug}.png`);
    await sharp(Buffer.from(svg)).png().toBuffer().then((buf) => {
      fs.writeFileSync(outputPath, buf);
    });
    console.log(`Generated: public/og/${slug}.png (Title: ${data.title})`);
  }

  console.log('OGP generation complete!');
}

main().catch((err) => {
  console.error('Error generating OGP images:', err);
  process.exit(1);
});
