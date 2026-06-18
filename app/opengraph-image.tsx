import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'VocabQuest — Interactive Language Learning';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5d0e8 0%, #b8e6d0 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.85)',
            borderRadius: 32,
            padding: '48px 80px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 700, color: '#6b4f9a', marginBottom: 16 }}>
            VocabQuest
          </div>
          <div style={{ fontSize: 32, color: '#4a5568', textAlign: 'center' }}>
            Learn Korean, Japanese & French
          </div>
          <div style={{ fontSize: 22, color: '#6db89a', marginTop: 20 }}>
            Interactive vocabulary games & AI practice chat
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
