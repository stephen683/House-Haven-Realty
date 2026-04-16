import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'About House Haven Realty'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{ background: 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
        <div style={{ fontSize: '64px', fontWeight: 700, color: 'white', textAlign: 'center' }}>House Haven Realty</div>
        <div style={{ fontSize: '24px', color: '#C6C4C4', marginTop: '16px' }}>A boutique Nashville brokerage — 500+ homes, $250M+ volume</div>
        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.4)', marginTop: '24px' }}>(615) 624-4766 &middot; househavenrealty.com</div>
      </div>
    ),
    { ...size },
  )
}
