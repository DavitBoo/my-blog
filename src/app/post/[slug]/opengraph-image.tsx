import { ImageResponse } from 'next/og';
import { fetchPostBySlug } from '@/app/utils/api';
import { ILabel } from '@/interfaces/Label';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  const title = post?.title ?? 'Diogenes Brain';
  const labels: ILabel[] = post?.labels?.slice(0, 3) ?? [];

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
      {/* Accent line */}
      <div style={{ width: 80, height: 4, background: '#04adbf', marginBottom: 32 }} />

      {/* Title */}
      <div
        style={{
          color: '#e2f5fa',
          fontSize: title.length > 60 ? 44 : 56,
          fontWeight: 700,
          lineHeight: 1.25,
          marginBottom: 32,
          maxWidth: 900,
        }}
      >
        {title}
      </div>

      {/* Labels */}
      {labels.length > 0 && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          {labels.map((label) => (
            <div
              key={label.id}
              style={{
                background: '#04bfbf',
                color: '#0f1e26',
                padding: '6px 18px',
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {label.name}
            </div>
          ))}
        </div>
      )}

      {/* Site name */}
      <div style={{ color: '#a4ddf4', fontSize: 24 }}>Diogenes Brain</div>
    </div>,
    { ...size },
  );
}
