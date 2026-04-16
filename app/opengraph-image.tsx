import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'House Haven Realty — Nashville Real Estate'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            House Haven Realty
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#C6C4C4',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
            }}
          >
            Nashville Real Estate
          </div>
          <div
            style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.6)',
              marginTop: '16px',
            }}
          >
            (615) 624-4766 &middot; househavenrealty.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
