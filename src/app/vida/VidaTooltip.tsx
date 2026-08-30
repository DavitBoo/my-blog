'use client';

import { RefObject } from 'react';
import styles from './vida.module.css';
import { VidaHoverInfo } from './vidaEngine';

interface Props {
  tipRef: RefObject<HTMLDivElement | null>;
  hover: VidaHoverInfo | null;
}

const VidaTooltip = ({ tipRef, hover }: Props) => (
  <div ref={tipRef} className={styles.tooltip}>
    {hover && (
      <div className={styles.tooltipCard}>
        <div className={styles.tooltipEyebrow}>{hover.categoria}</div>
        <div className={styles.tooltipTitle}>{hover.titulo}</div>
        <div className={styles.tooltipResumen}>{hover.resumen}</div>
      </div>
    )}
  </div>
);

export default VidaTooltip;
