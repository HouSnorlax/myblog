import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const FONT_FAMILY = `'Meiryo', 'BIZ UDPGothic', 'Hiragino Sans', 'Noto Sans CJK JP', sans-serif`;

const LINE_START_FORBIDDEN = new Set([
  '、', '。', '，', '．', '！', '？', '!', '?',
  '）', '」', '』', '】', '…', 'ー', '：', '；',
  ':', ';', ')', ']', '}', '＞', '>'
]);

// 1文字のプロポーショナル幅（全角を1.0とした近似値）
function getCharWidthUnits(char: string): number {
  const code = char.charCodeAt(0);
  if (code >= 0x0020 && code <= 0x007e) {
    if (['i', 'l', 'I', '.', ',', '!', ':', ';', ' '].includes(char)) return 0.28;
    if (['w', 'm', 'W', 'M', '@'].includes(char)) return 0.82;
    if (['r', 't', 'f', 'j'].includes(char)) return 0.35;
    return 0.52;
  }
  if (code >= 0xff61 && code <= 0xff9f) {
    return 0.5;
  }
  return 1.0;
}

function getStringWidthUnits(str: string): number {
  let w = 0;
  for (const c of str) {
    w += getCharWidthUnits(c);
  }
  return w;
}

// テキストをトークン（単語／文字）に分割（英単語や数字＋助数詞を塊として保持）
function tokenize(text: string): string[] {
  const tokens: string[] = [];
  const regex = /[a-zA-Z0-9_\-&/.:]+(?:[位年月日時分秒人回個つ円度点本枚台話部期%％]|か月|ヵ月)?|[\s]+|[^\s]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    tokens.push(match[0]);
  }
  return tokens;
}

// 禁則処理と単語分割を考慮したテキスト折り返し
export function wrapTextWithKinsoku(text: string, maxUnitsPerLine: number, maxLines: number = 3): string[] {
  if (!text) return [];
  const tokens = tokenize(text);
  const lines: string[] = [];
  let currentLine = '';
  let currentUnits = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const tokenUnits = getStringWidthUnits(token);

    if (!currentLine && /^\s+$/.test(token)) {
      continue;
    }

    if (tokenUnits > maxUnitsPerLine && token.length > 1) {
      for (const char of token) {
        const cUnit = getCharWidthUnits(char);
        if (currentUnits + cUnit > maxUnitsPerLine) {
          lines.push(currentLine);
          currentLine = char;
          currentUnits = cUnit;
          if (lines.length >= maxLines) break;
        } else {
          currentLine += char;
          currentUnits += cUnit;
        }
      }
      continue;
    }

    if (currentUnits + tokenUnits > maxUnitsPerLine) {
      if (LINE_START_FORBIDDEN.has(token) && currentLine.length > 0) {
        currentLine += token;
        lines.push(currentLine);
        currentLine = '';
        currentUnits = 0;
      } else {
        lines.push(currentLine);
        currentLine = token;
        currentUnits = tokenUnits;
      }

      if (lines.length === maxLines - 1) {
        const remainingTokens = tokens.slice(i + 1);
        let remUnits = currentUnits;
        let lastLine = currentLine;
        for (let j = 0; j < remainingTokens.length; j++) {
          const nextTok = remainingTokens[j];
          const nextU = getStringWidthUnits(nextTok);
          if (remUnits + nextU + 1.2 > maxUnitsPerLine) {
            lastLine += '...';
            break;
          }
          lastLine += nextTok;
          remUnits += nextU;
        }
        lines.push(lastLine);
        return lines;
      }
    } else {
      currentLine += token;
      currentUnits += tokenUnits;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  return lines;
}

export function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// アイコンキャッシュ
let cachedIconBase64: string | null = null;
function getIconBase64(): string {
  if (cachedIconBase64 !== null) return cachedIconBase64;
  try {
    const iconPath = path.resolve('public/13.png');
    if (fs.existsSync(iconPath)) {
      cachedIconBase64 = fs.readFileSync(iconPath).toString('base64');
      return cachedIconBase64;
    }
  } catch (e) {
    console.warn('Failed to read public/13.png:', e);
  }
  cachedIconBase64 = '';
  return '';
}

interface OgpOptions {
  title: string;
  snippet?: string;
  siteTitle?: string;
  domain?: string;
}

/**
 * C-1 スタイル（Note Minimal: 左揃え・下部アイコン）のSVGを生成
 */
export function generateC1OgpSvg({
  title,
  snippet = '',
  siteTitle = 'MUHOのブログ',
  domain = 'muho.muho.workers.dev'
}: OgpOptions): string {
  const width = 1200;
  const height = 630;

  // タイトル折り返し（1行全角約19文字、最大3行）
  const titleLines = wrapTextWithKinsoku(title, 19, 3);
  const titleFontSize = titleLines.length >= 3 ? 52 : 60;
  const titleLineHeight = titleLines.length >= 3 ? 72 : 84;

  // 概要 (snippet) 折り返し（1行全角約26文字、最大2行）
  const snippetLines = snippet ? wrapTextWithKinsoku(snippet, 26, 2) : [];
  const snippetFontSize = 36;
  const snippetLineHeight = 56;

  const contentStartX = 100;

  const titleBlockHeight = titleLines.length * titleLineHeight;
  const gap = snippetLines.length > 0 ? 38 : 0;
  const snippetBlockHeight = snippetLines.length * snippetLineHeight;
  const totalContentHeight = titleBlockHeight + gap + snippetBlockHeight;

  // 縦方向中央配置
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

  const iconBase64 = getIconBase64();
  const iconTag = iconBase64 ? `
    <clipPath id="iconClip">
      <circle cx="132" cy="530" r="28" />
    </clipPath>
    <image href="data:image/png;base64,${iconBase64}" x="104" y="502" width="56" height="56" clip-path="url(#iconClip)" />
    <circle cx="132" cy="530" r="28" fill="none" stroke="#E2E8F0" stroke-width="1.5" />
  ` : '';

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- 背景（白） -->
  <rect width="${width}" height="${height}" fill="#FFFFFF" />
  <!-- 外周の繊細な枠線（SNSでの白飛び防止） -->
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
  `.trim();
}

/**
 * SVGからPNG画像を生成してBufferを返す
 */
export async function generateOgpPng(options: OgpOptions): Promise<Buffer> {
  const svg = generateC1OgpSvg(options);
  return await sharp(Buffer.from(svg)).png().toBuffer();
}
