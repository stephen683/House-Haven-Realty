import { ImageResponse } from 'next/og'
import { ZIP_META_MAP, PIPELINE_ZIPS } from '@/lib/pipeline-zips'

export const runtime = 'edge'
export const alt = 'Nashville Pipeline ZIP Page'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateImageMetadata() {
  return PIPELINE_ZIPS.map((z) => ({
    id: z.zip,
    alt: `New Construction in ${z.zip} ${z.name} — Nashville Pipeline`,
    size,
    contentType,
  }))
}

export default function OGImage({ params }: { params: { zip: string } }) {
  const meta = ZIP_META_MAP[params.zip]
  const name = meta?.name || params.zip

  return new ImageResponse(
    (
      <div style={{ background: '#000', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui' }}>
        <div style={{ fontSize: '28px', color: '#C6C4C4', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Nashville Pipeline</div>
        <div style={{ fontSize: '72px', fontWeight: 700, color: 'white', textAlign: 'center', marginTop: '16px' }}>New Construction in {params.zip}</div>
        <div style={{ fontSize: '28px', color: 'rgba(255,255,255,0.7)', marginTop: '12px' }}>{name}, Nashville TN</div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginTop: '24px' }}>House Haven Realty &middot; househavenrealty.com/pipeline/{params.zip}</div>
      </div>
    ),
    { ...size },
  )
}
