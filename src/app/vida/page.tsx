'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Loader from '../components/Loader';
import VidaFallback from './VidaFallback';

const VidaScene = dynamic(() => import('./VidaScene'), {
  ssr: false,
  loading: () => <Loader message="Levantando el archipiélago..." />,
});

const K_VISTA = 'vida:vista';

type Vista = 'escena' | 'lista';

const soportaWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
};

const leerVista = (): Vista => {
  try {
    return localStorage.getItem(K_VISTA) === 'lista' ? 'lista' : 'escena';
  } catch {
    return 'escena';
  }
};

const VidaPage = () => {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [vista, setVista] = useState<Vista>('escena');
  const cambiada = useRef(false);

  useEffect(() => {
    setVista(leerVista());
    setWebgl(soportaWebGL());
  }, []);

  const cambiarVista = (nueva: Vista) => {
    cambiada.current = true;
    setVista(nueva);
    try {
      localStorage.setItem(K_VISTA, nueva);
    } catch {
      /* solo se pierde el recordatorio de la preferencia */
    }
  };

  if (webgl === null) return <Loader message="Levantando el archipiélago..." />;
  if (!webgl) return <VidaFallback />;

  return vista === 'lista' ? (
    <VidaFallback onVerEscena={() => cambiarVista('escena')} enfocarAlMontar={cambiada.current} />
  ) : (
    <VidaScene onVerLista={() => cambiarVista('lista')} enfocarAlMontar={cambiada.current} />
  );
};

export default VidaPage;
