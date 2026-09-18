// 禁則文字の定義
const LINE_START_FORBIDDEN = new Set(['、', '。', '，', '．', '！', '？', '!', '?', '）', '」', '』', '】', '…', 'ー', '：', '；', ':', ';', ')', ']', '}', '＞', '>']);
const LINE_END_FORBIDDEN = new Set(['（', '「', '『', '【', '(', '[', '{', '＜', '<']);

// プロポーショナル文字幅計算
export function getCharWidthUnits(char) {
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

export function getStringWidthUnits(str) {
  let w = 0;
  for (const c of str) {
    w += getCharWidthUnits(c);
  }
  return w;
}

// テキストをトークン（単語／文字の最小単位）に分割
function tokenize(text) {
  // 数字＋助数詞（1位、2年、1か月など）、英単語、空白、その他の文字
  const tokens = [];
  const regex = /[a-zA-Z0-9_\-&/.:]+(?:[位年月日時分秒人回個つ円度点本枚台話部期%％]|か月|ヵ月)?|[\s]+|[^\s]/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    tokens.push(match[0]);
  }
  return tokens;
}

// 禁則処理と単語分割を考慮した折り返し
export function wrapTextWithKinsoku(text, maxUnitsPerLine, maxLines = 3) {
  const tokens = tokenize(text);
  const lines = [];
  let currentLine = '';
  let currentUnits = 0;

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    let tokenUnits = getStringWidthUnits(token);

    // 空白文字が先頭に来た場合は無視
    if (!currentLine && /^\s+$/.test(token)) {
      continue;
    }

    // 単語自体が1行の長さを超えている場合は文字単位に分割して処理
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

    // 次のトークンを追加すると行あふれする場合
    if (currentUnits + tokenUnits > maxUnitsPerLine) {
      // 禁則処理：もしトークンが行頭禁則文字なら、現在の行に押し込む
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

      // 上限行数に達した場合
      if (lines.length === maxLines - 1) {
        // 最終行の構築：残りのトークンを詰めて末尾に...
        let remainingTokens = tokens.slice(i + 1);
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

// XMLエスケープ
export function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}
