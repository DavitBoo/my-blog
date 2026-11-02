'use client';

import { RefObject } from 'react';
import Link from 'next/link';
import styles from './vida.module.css';
import { VidaLibrosPreview } from '../utils/vidaApi';

interface Props {
  lecturas: VidaLibrosPreview;
  onClose: () => void;
  closeRef: RefObject<HTMLButtonElement | null>;
}

const VidaLecturasPanel = ({ lecturas, onClose, closeRef }: Props) => (
  <div
    className={`${styles.panel} ${styles.panelLecturas}`}
    role="dialog"
    aria-label="La biblioteca"
  >
    <div className={`${styles.panelHeader} ${styles.panelHeaderLecturas}`}>
      <div className={styles.panelHeaderText}>
        <span className={styles.panelEyebrowGold}>Isla de las lecturas</span>
        <div className={styles.panelTitle}>La biblioteca</div>
        <div className={styles.panelSubtitleGold}>
          Los libros no caben en 3D. Viven en su propia página.
        </div>
      </div>
      <button
        ref={closeRef}
        onClick={onClose}
        className={`${styles.closeBtn} ${styles.closeBtnGold}`}
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>

    <div className={styles.panelBody} tabIndex={0}>
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{lecturas.total}</span>
          <span className={styles.statLabel}>libros leídos</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{lecturas.este_anio}</span>
          <span className={styles.statLabel}>este año</span>
        </div>
      </div>

      {lecturas.cifra && <div className={styles.cifra}>{lecturas.cifra}</div>}

      {lecturas.destacados.length > 0 && (
        <div className={styles.mediaList}>
          <div className={styles.destacadosTitle}>Últimos destacados</div>
          {lecturas.destacados.map((l, i) => (
            <div key={i} className={styles.libroRow}>
              <div className={styles.libroSpine} style={{ background: l.color || '#8a6a3d' }} />
              <div className={styles.libroText}>
                <span className={styles.libroTitulo}>{l.titulo}</span>
                <span className={styles.libroAutor}>
                  {l.autor} · {l.anio_lectura}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href="/libros" className={styles.libroCta}>
        <span>Ver el catálogo completo</span>
        <span>→</span>
      </Link>
    </div>
  </div>
);

export default VidaLecturasPanel;
