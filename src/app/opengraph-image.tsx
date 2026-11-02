import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Diogenes Brain, el blog de David';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: '#0f1e26',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: '64px',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ width: 80, height: 4, background: '#04adbf', marginBottom: 32 }} />
      <div style={{ color: '#e2f5fa', fontSize: 72, fontWeight: 700, marginBottom: 24 }}>
        Diogenes Brain
      </div>
      <div style={{ color: '#a4ddf4', fontSize: 32, lineHeight: 1.35, maxWidth: 900 }}>
        Aprendo cosas, experimento y te las cuento: programación, lutheria, idiomas, viajes...
      </div>
    </div>,
    { ...size },
  );
}
