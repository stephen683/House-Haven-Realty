import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Nashville Pipeline — Every Home Being Built in Nashville'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{ background: '#000', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
        <div style={{ fontSize: '24px', color: '#C6C4C4', letterSpacing: '0.15em', textTransform: 'uppercase' }}>House Haven Realty</div>
        <div style={{ fontSize: '64px', fontWeight: 700, color: 'white', textAlign: 'center', marginTop: '12px' }}>Nashville Pipeline</div>
        <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.7)', marginTop: '12px', textAlign: 'center' }}>See what is being built before it is built.</div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          <div style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>Live Permits</div>
          <div style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>Saturation Scores</div>
          <div style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>Builder Profiles</div>
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '24px' }}>househavenrealty.com/pipeline</div>
      </div>
    ),
    { ...size },
  )
}
