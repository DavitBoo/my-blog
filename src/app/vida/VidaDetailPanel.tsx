"use client";

import styles from "./vida.module.css";
import { VidaEnlace, VidaMediaItem } from "../utils/vidaApi";

export interface VidaDetalleRelacionado {
  slug: string;
  titulo: string;
  categoria: string;
}

export interface VidaDetalle {
  slug: string;
  titulo: string;
  subtitulo: string | null;
  resumen: string;
  categoria: string;
  ambito: string;
  tieneAmbito: boolean;
  fecha: string;
  peso: number;
  lugar: string;
  tieneLugar: boolean;
  parrafos: string[];
  tieneDesc: boolean;
  media: VidaMediaItem[];
  tieneMedia: boolean;
  meta: { k: string; v: string }[];
  tieneMeta: boolean;
  tags: string[];
  tieneTags: boolean;
  enlaces: VidaEnlace[];
  tieneEnlaces: boolean;
  relacionados: VidaDetalleRelacionado[];
  tieneRel: boolean;
}

interface Props {
  sel: VidaDetalle;
  onClose: () => void;
  onIrA: (slug: string) => void;
}

const VidaDetailPanel = ({ sel, onClose, onIrA }: Props) => (
  <div className={styles.panel}>
    <div className={styles.panelHeader}>
      <div className={styles.panelHeaderText}>
        <div className={styles.panelBadges}>
          <span className={styles.panelEyebrow}>{sel.categoria}</span>
          {sel.tieneAmbito && <span className={styles.panelAmbito}>{sel.ambito}</span>}
        </div>
        <div className={styles.panelTitle}>{sel.titulo}</div>
        {sel.subtitulo && <div className={styles.panelSubtitle}>{sel.subtitulo}</div>}
      </div>
      <button onClick={onClose} className={styles.closeBtn} aria-label="Cerrar">
        ×
      </button>
    </div>

    <div className={styles.panelBody}>
      <div className={styles.metaRow}>
        <span className={styles.metaRowItem}>
          <span className={styles.metaRowIcon}>◷</span>
          {sel.fecha}
        </span>
        {sel.tieneLugar && (
          <span className={styles.metaRowItem}>
            <span className={styles.metaRowIcon}>◈</span>
            {sel.lugar}
          </span>
        )}
        <span className={styles.metaRowItem}>
          <span className={styles.metaRowIcon}>▲</span>
          presencia {sel.peso} de 5
        </span>
      </div>

      <div className={styles.resumenText}>{sel.resumen}</div>

      {sel.tieneDesc && (
        <div className={styles.parrafos}>
          {sel.parrafos.map((p, i) => (
            <div key={i} className={styles.parrafo}>
              {p}
            </div>
          ))}
        </div>
      )}

      {sel.tieneMedia && (
        <div className={styles.mediaList}>
          {sel.media.map((m, i) => (
            <div key={i} className={styles.mediaItem} style={{ backgroundImage: `url(${m.src})` }}>
              <div className={styles.mediaLabel}>{m.tipo}</div>
              {m.alt && <div className={styles.mediaAlt}>{m.alt}</div>}
            </div>
          ))}
        </div>
      )}

      {sel.tieneMeta && (
        <div className={styles.metaTable}>
          {sel.meta.map((par) => (
            <div key={par.k} className={styles.metaTableRow}>
              <span className={styles.metaTableKey}>{par.k}</span>
              <span className={styles.metaTableValue}>{par.v}</span>
            </div>
          ))}
        </div>
      )}

      {sel.tieneTags && (
        <div className={styles.tags}>
          {sel.tags.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
      )}

      {sel.tieneEnlaces && (
        <div className={styles.enlaces}>
          {sel.enlaces.map((e, i) => (
            <a key={i} href={e.url} target="_blank" rel="noreferrer" className={styles.enlace}>
              <span>{e.etiqueta || e.tipo}</span>
              <span className={styles.enlaceArrow}>→</span>
            </a>
          ))}
        </div>
      )}

      {sel.tieneRel && (
        <div className={styles.relBlock}>
          <div className={styles.relTitle}>Conectado con</div>
          <div className={styles.relHint}>Los arcos sobre el mar unen este ítem con otras islas.</div>
          {sel.relacionados.map((r) => (
            <button key={r.slug} onClick={() => onIrA(r.slug)} className={styles.relItem}>
              <span className={styles.relItemText}>
                <span className={styles.relItemEyebrow}>{r.categoria}</span>
                <span className={styles.relItemTitulo}>{r.titulo}</span>
              </span>
              <span className={styles.relItemArrow}>↗</span>
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default VidaDetailPanel;
