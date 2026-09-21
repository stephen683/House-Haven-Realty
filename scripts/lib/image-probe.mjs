// Identify an image and read its real dimensions from the bytes.
//
// A status code proves nothing about what arrived: a cancelled CDN can answer
// 200 with an HTML error page, and a misconfigured one can answer with a
// tracking pixel. An unattended migration that trusts either ships a broken
// face to production, so headshots are accepted only on what the bytes say.

/** @returns {'jpg'|'png'|'webp'|null} */
export function imageFormat(buf) {
  if (buf.length < 16) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg'
  if (buf[0] === 0x89 && buf.subarray(1, 4).toString('latin1') === 'PNG') return 'png'
  if (buf.subarray(0, 4).toString('latin1') === 'RIFF' &&
      buf.subarray(8, 12).toString('latin1') === 'WEBP') return 'webp'
  return null
}

function pngSize(buf) {
  // IHDR is always the first chunk: length(4) "IHDR"(4) width(4) height(4).
  if (buf.subarray(12, 16).toString('latin1') !== 'IHDR') return null
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

function jpegSize(buf) {
  // Walk the marker segments to a Start Of Frame; SOF4/8/12 are not frames.
  let i = 2
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i++; continue }
    const marker = buf[i + 1]
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue }
    const len = buf.readUInt16BE(i + 2)
    if (len < 2) return null
    i += 2 + len
  }
  return null
}

function webpSize(buf) {
  const kind = buf.subarray(12, 16).toString('latin1')
  const p = 20 // payload start: RIFF(12) + chunk id(4) + chunk size(4)
  if (kind === 'VP8 ') {
    // 3-byte frame tag, 3-byte start code, then 14-bit width and height.
    if (buf[p + 3] !== 0x9d || buf[p + 4] !== 0x01 || buf[p + 5] !== 0x2a) return null
    return { width: buf.readUInt16LE(p + 6) & 0x3fff, height: buf.readUInt16LE(p + 8) & 0x3fff }
  }
  if (kind === 'VP8L') {
    if (buf[p] !== 0x2f) return null
    const b = buf.readUInt32LE(p + 1)
    return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 }
  }
  if (kind === 'VP8X') {
    const w = buf[p + 4] | (buf[p + 5] << 8) | (buf[p + 6] << 16)
    const h = buf[p + 7] | (buf[p + 8] << 8) | (buf[p + 9] << 16)
    return { width: w + 1, height: h + 1 }
  }
  return null
}

/** @returns {{format: string, width: number, height: number} | null} */
export function probeImage(buf) {
  const format = imageFormat(buf)
  if (!format) return null
  const size = format === 'png' ? pngSize(buf) : format === 'jpg' ? jpegSize(buf) : webpSize(buf)
  if (!size || !size.width || !size.height) return null
  return { format, ...size }
}

/** Minimum a headshot may be and still be worth putting on a profile page. */
export const MIN_EDGE = 200

/**
 * @returns {string|null} why this is not a usable headshot, or null if it is.
 */
export function rejectReason(buf) {
  const probe = probeImage(buf)
  if (!probe) return 'not a decodable JPEG, PNG or WebP'
  const { width, height } = probe
  if (width < MIN_EDGE || height < MIN_EDGE) return `only ${width}x${height} — too small for a headshot`
  const ratio = width / height
  if (ratio < 0.4 || ratio > 2.5) return `aspect ${ratio.toFixed(2)} — not a portrait crop`
  return null
}
