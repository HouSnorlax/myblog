import { wrapTextWithKinsoku, escapeXml } from './ogp_utils.mjs';

const FONT_FAMILY = `'Meiryo', 'BIZ UDPGothic', 'Hiragino Sans', 'Noto Sans CJK JP', sans-serif`;

/**
 * C-1: Note Minimal - クラシック（左揃え・下部アイコン）
 * 余白の美しさを活かしたnoteの王道デザイン
 */
export function renderNoteMinimalC1({
  title,
  snippet,
  siteTitle = 'MUHOのブログ',
  domain = 'muho.muho.workers.dev',
  iconBase64 = ''
}) {
  const width = 1200;
  const height = 630;

  const titleLines = wrapTextWithKinsoku(title, 19, 3);
  const titleFontSize = titleLines.length >= 3 ? 52 : 60;
  const titleLineHeight = titleLines.length >= 3 ? 72 : 84;

  const snippetLines = wrapTextWithKinsoku(snippet, 26, 2);
  const snippetFontSize = 36;
  const snippetLineHeight = 56;

  const contentStartX = 100;

  const titleBlockHeight = titleLines.length * titleLineHeight;
  const gap = 38;
  const snippetBlockHeight = snippetLines.length * snippetLineHeight;
  const totalContentHeight = titleBlockHeight + gap + snippetBlockHeight;

  let currentY = Math.round(250 - (totalContentHeight / 2) + titleFontSize * 0.85);

  const titleSvg = titleLines.map((line, idx) => {
    const y = currentY + (idx * titleLineHeight);
    return `<text x="${contentStartX}" y="${y}" font-size="${titleFontSize}" font-weight="bold" font-family="${FONT_FAMILY}" fill="#0F172A">${escapeXml(line)}</text>`;
  }).join('\n');

  currentY += (titleLines.length * titleLineHeight) + gap;

  const snippetSvg = snippetLines.map((line, idx) => {
    const y = currentY + (idx * snippetLineHeight);
    return `<text x="${contentStartX}" y="${y}" font-size="${snippetFontSize}" font-weight="500" font-family="${FONT_FAMILY}" fill="#334155">${escapeXml(line)}</text>`;
  }).join('\n');

  const iconTag = iconBase64 ? `
    <clipPath id="iconClipC1">
      <circle cx="132" cy="530" r="28" />
    </clipPath>
    <image href="data:image/png;base64,${iconBase64}" x="104" y="502" width="56" height="56" clip-path="url(#iconClipC1)" />
    <circle cx="132" cy="530" r="28" fill="none" stroke="#E2E8F0" stroke-width="1.5" />
  ` : '';

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#FFFFFF" />
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#E2E8F0" stroke-width="2" />

  <!-- タイトル -->
  ${titleSvg}

  <!-- 概要 (snippet) -->
  ${snippetSvg}

  <!-- フッター：アイコン ＋ サイト名 -->
  ${iconTag}
  <text x="${iconBase64 ? 176 : 100}" y="528" font-size="24" font-weight="bold" font-family="${FONT_FAMILY}" fill="#0F172A">${escapeXml(siteTitle)}</text>
  <text x="${iconBase64 ? 176 : 100}" y="554" font-size="16" font-family="${FONT_FAMILY}" fill="#64748B">${escapeXml(domain)}</text>
</svg>
  `;
}

/**
 * C-2: Note Minimal - アクセントライン入り（メリハリ強調）
 * タイトルと概要の間に短いブルーラインを配置
 */
export function renderNoteMinimalC2({
  title,
  snippet,
  siteTitle = 'MUHOのブログ',
  domain = 'muho.muho.workers.dev',
  iconBase64 = ''
}) {
  const width = 1200;
  const height = 630;

  const titleLines = wrapTextWithKinsoku(title, 19, 3);
  const titleFontSize = titleLines.length >= 3 ? 52 : 60;
  const titleLineHeight = titleLines.length >= 3 ? 72 : 84;

  const snippetLines = wrapTextWithKinsoku(snippet, 26, 2);
  const snippetFontSize = 36;
  const snippetLineHeight = 56;

  const contentStartX = 100;

  const titleBlockHeight = titleLines.length * titleLineHeight;
  const dividerGap = 24;
  const dividerHeight = 4;
  const snippetGap = 32;
  const snippetBlockHeight = snippetLines.length * snippetLineHeight;
  const totalContentHeight = titleBlockHeight + dividerGap + dividerHeight + snippetGap + snippetBlockHeight;

  let currentY = Math.round(245 - (totalContentHeight / 2) + titleFontSize * 0.85);

  const titleSvg = titleLines.map((line, idx) => {
    const y = currentY + (idx * titleLineHeight);
    return `<text x="${contentStartX}" y="${y}" font-size="${titleFontSize}" font-weight="bold" font-family="${FONT_FAMILY}" fill="#0F172A">${escapeXml(line)}</text>`;
  }).join('\n');

  currentY += (titleLines.length * titleLineHeight) + dividerGap;

  const dividerSvg = `
    <rect x="${contentStartX}" y="${currentY}" width="70" height="4" rx="2" fill="#2563EB" />
  `;

  currentY += dividerHeight + snippetGap;

  const snippetSvg = snippetLines.map((line, idx) => {
    const y = currentY + (idx * snippetLineHeight);
    return `<text x="${contentStartX}" y="${y}" font-size="${snippetFontSize}" font-weight="500" font-family="${FONT_FAMILY}" fill="#334155">${escapeXml(line)}</text>`;
  }).join('\n');

  const iconTag = iconBase64 ? `
    <clipPath id="iconClipC2">
      <circle cx="132" cy="530" r="28" />
    </clipPath>
    <image href="data:image/png;base64,${iconBase64}" x="104" y="502" width="56" height="56" clip-path="url(#iconClipC2)" />
    <circle cx="132" cy="530" r="28" fill="none" stroke="#E2E8F0" stroke-width="1.5" />
  ` : '';

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#FFFFFF" />
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#E2E8F0" stroke-width="2" />

  <!-- タイトル -->
  ${titleSvg}

  <!-- アクセントバー -->
  ${dividerSvg}

  <!-- 概要 (snippet) -->
  ${snippetSvg}

  <!-- フッター -->
  ${iconTag}
  <text x="${iconBase64 ? 176 : 100}" y="528" font-size="24" font-weight="bold" font-family="${FONT_FAMILY}" fill="#0F172A">${escapeXml(siteTitle)}</text>
  <text x="${iconBase64 ? 176 : 100}" y="554" font-size="16" font-family="${FONT_FAMILY}" fill="#64748B">${escapeXml(domain)}</text>
</svg>
  `;
}

/**
 * C-3: Note Minimal - 上部ヘッダー型
 * ブログ情報（アイコン・名前）を上部に配置し、下部を広く活用
 */
export function renderNoteMinimalC3({
  title,
  snippet,
  siteTitle = 'MUHOのブログ',
  domain = 'muho.muho.workers.dev',
  iconBase64 = ''
}) {
  const width = 1200;
  const height = 630;

  const titleLines = wrapTextWithKinsoku(title, 19, 3);
  const titleFontSize = titleLines.length >= 3 ? 52 : 60;
  const titleLineHeight = titleLines.length >= 3 ? 72 : 84;

  const snippetLines = wrapTextWithKinsoku(snippet, 26, 2);
  const snippetFontSize = 36;
  const snippetLineHeight = 56;

  const contentStartX = 100;

  // 上部ヘッダー（y=80）
  // タイトルと概要を縦中央（y=310付近）に配置
  const titleBlockHeight = titleLines.length * titleLineHeight;
  const gap = 38;
  const snippetBlockHeight = snippetLines.length * snippetLineHeight;
  const totalContentHeight = titleBlockHeight + gap + snippetBlockHeight;

  let currentY = Math.round(310 - (totalContentHeight / 2) + titleFontSize * 0.85);

  const titleSvg = titleLines.map((line, idx) => {
    const y = currentY + (idx * titleLineHeight);
    return `<text x="${contentStartX}" y="${y}" font-size="${titleFontSize}" font-weight="bold" font-family="${FONT_FAMILY}" fill="#0F172A">${escapeXml(line)}</text>`;
  }).join('\n');

  currentY += (titleLines.length * titleLineHeight) + gap;

  const snippetSvg = snippetLines.map((line, idx) => {
    const y = currentY + (idx * snippetLineHeight);
    return `<text x="${contentStartX}" y="${y}" font-size="${snippetFontSize}" font-weight="500" font-family="${FONT_FAMILY}" fill="#334155">${escapeXml(line)}</text>`;
  }).join('\n');

  const iconTag = iconBase64 ? `
    <clipPath id="iconClipC3">
      <circle cx="128" cy="80" r="28" />
    </clipPath>
    <image href="data:image/png;base64,${iconBase64}" x="100" y="52" width="56" height="56" clip-path="url(#iconClipC3)" />
    <circle cx="128" cy="80" r="28" fill="none" stroke="#E2E8F0" stroke-width="1.5" />
  ` : '';

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#FFFFFF" />
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#E2E8F0" stroke-width="2" />

  <!-- 上部ヘッダー -->
  ${iconTag}
  <text x="${iconBase64 ? 172 : 100}" y="78" font-size="24" font-weight="bold" font-family="${FONT_FAMILY}" fill="#0F172A">${escapeXml(siteTitle)}</text>
  <text x="${iconBase64 ? 172 : 100}" y="104" font-size="16" font-family="${FONT_FAMILY}" fill="#64748B">${escapeXml(domain)}</text>

  <!-- タイトル -->
  ${titleSvg}

  <!-- 概要 (snippet) -->
  ${snippetSvg}
</svg>
  `;
}
