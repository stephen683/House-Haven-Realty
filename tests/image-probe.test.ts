import { describe, it, expect } from 'vitest'
import { probeImage, rejectReason, MIN_EDGE } from '../scripts/lib/image-probe.mjs'

// Fixtures are built byte-by-byte rather than mocked: the whole point of the
// prober is that it reads real container headers, so a mock would test nothing.
function riff(fourcc: string, payload: Buffer) {
  if (payload.length % 2) payload = Buffer.concat([payload, Buffer.from([0])])
  const size = Buffer.alloc(4); size.writeUInt32LE(payload.length)
  const body = Buffer.concat([Buffer.from('WEBP'), Buffer.from(fourcc), size, payload])
  const total = Buffer.alloc(4); total.writeUInt32LE(body.length)
  return Buffer.concat([Buffer.from('RIFF'), total, body])
}
function vp8(w: number, h: number) {
  const d = Buffer.alloc(4); d.writeUInt16LE(w, 0); d.writeUInt16LE(h, 2)
  return riff('VP8 ', Buffer.concat([
    Buffer.from([0, 0, 0, 0x9d, 0x01, 0x2a]), d, Buffer.alloc(32)]))
}
function vp8l(w: number, h: number) {
  const b = Buffer.alloc(4); b.writeUInt32LE((w - 1) | ((h - 1) << 14))
  return riff('VP8L', Buffer.concat([Buffer.from([0x2f]), b, Buffer.alloc(32)]))
}
function vp8x(w: number, h: number) {
  const u24 = (v: number) => Buffer.from([v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff])
  return riff('VP8X', Buffer.concat([
    Buffer.from([0x10, 0, 0, 0]), u24(w - 1), u24(h - 1)]))
}
function jpeg(w: number, h: number) {
  const sof = Buffer.alloc(19)
  sof.writeUInt16BE(0xffc0, 0); sof.writeUInt16BE(17, 2); sof.writeUInt8(8, 4)
  sof.writeUInt16BE(h, 5); sof.writeUInt16BE(w, 7)
  return Buffer.concat([Buffer.from([0xff, 0xd8]), sof, Buffer.from([0xff, 0xd9])])
}

describe('image probe', () => {
  it('reads dimensions from every WebP variant the CDN might serve', () => {
    expect(probeImage(vp8(512, 640))).toEqual({ format: 'webp', width: 512, height: 640 })
    expect(probeImage(vp8l(300, 400))).toEqual({ format: 'webp', width: 300, height: 400 })
    expect(probeImage(vp8x(1024, 1280))).toEqual({ format: 'webp', width: 1024, height: 1280 })
  })

  it('reads dimensions from a JPEG start-of-frame', () => {
    expect(probeImage(jpeg(450, 600))).toEqual({ format: 'jpg', width: 450, height: 600 })
  })

  it('rejects an HTML error page served with a 200', () => {
    const html = Buffer.from('<!DOCTYPE html><html><head><title>404 Not Found</title></head></html>')
    expect(probeImage(html)).toBeNull()
    expect(rejectReason(html)).toMatch(/not a decodable/)
  })

  it('rejects a tracking pixel', () => {
    expect(rejectReason(vp8(1, 1))).toMatch(/too small/)
  })

  it('rejects a banner-shaped crop that is not a portrait', () => {
    expect(rejectReason(vp8(1200, 300))).toMatch(/not a portrait/)
  })

  it('accepts a plausible headshot', () => {
    expect(rejectReason(vp8(MIN_EDGE, MIN_EDGE))).toBeNull()
    expect(rejectReason(vp8(800, 1000))).toBeNull()
  })
})
