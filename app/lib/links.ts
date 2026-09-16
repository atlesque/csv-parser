export interface TextSegment {
  text: string
  href?: string
}

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"']+/gi
const TRAILING_PUNCTUATION = /[.,!?;:]+$/

function isSafeUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.length > 0
  } catch {
    return false
  }
}

/**
 * Split text into ordinary text and safe HTTP(S) URL segments.
 * The input is never treated as HTML; consumers should render each segment
 * through Vue so that markup-looking text remains text.
 */
export function linkifyText(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let lastIndex = 0

  for (const match of text.matchAll(URL_PATTERN)) {
    const matchText = match[0]
    const matchIndex = match.index ?? 0
    let urlText = matchText
    let trailingText = ''

    while (TRAILING_PUNCTUATION.test(urlText)) {
      trailingText = urlText.slice(-1) + trailingText
      urlText = urlText.slice(0, -1)
    }

    const href = urlText.startsWith('www.') ? `https://${urlText}` : urlText
    if (!isSafeUrl(href)) {
      continue
    }

    if (matchIndex > lastIndex) {
      segments.push({ text: text.slice(lastIndex, matchIndex) })
    }
    segments.push({ text: urlText, href })
    if (trailingText) {
      segments.push({ text: trailingText })
    }
    lastIndex = matchIndex + matchText.length
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) })
  }

  return segments.length > 0 ? segments : [{ text }]
}
