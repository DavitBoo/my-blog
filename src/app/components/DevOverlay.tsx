"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { fetchTech } from "../utils/api";

type Tech = {
  app: { name: string; description: string };
  stack: {
    frontend: string;
    backend: string;
    database: string;
    hosting: string[]; // o string si prefieres
  };
};

const DEV_SEQUENCE = ["e", "a", "d", "g", "b", "e"];

export default function DevOverlay() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Tech | null>(null);
  const [sequenceIndex, setSequenceIndex] = useState(0);

  // Abrir con query/hash
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("stack") === "1" || window.location.hash.includes("stack")) {
      setOpen(true);
    }
  }, []);

  // Escucha secuencia dev
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = DEV_SEQUENCE[sequenceIndex];

      console.log(`Otra pista... Tecla: ${key}, Esperada: ${expected}`);

      if (key === expected) {
        const newIndex = sequenceIndex + 1;
        setSequenceIndex(newIndex);
      } else {
        // Si la tecla incorrecta es la primera de la secuencia, empezar desde 1
        if (key === DEV_SEQUENCE[0]) {
          setSequenceIndex(1);
        } else {
          setSequenceIndex(0);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sequenceIndex]);

  // Detectar cuando se completa la secuencia y abrir el modal
  useEffect(() => {
    if (sequenceIndex === DEV_SEQUENCE.length) {
      console.log("¡Secuencia 'dev' completada! Abriendo overlay...");
      setOpen(true);
      setSequenceIndex(0); // Resetear para futuras activaciones
    }
  }, [sequenceIndex]);

  // Cargar datos
  useEffect(() => {
    if (!open || data) return;
    fetchTech()
      .then(setData)
      .catch(() => setData(null));
  }, [open, data]);

  if (!open) return null;

  return (
    <div className="dev-overlay">
      <div className="dev-overlay-header d-flex justify-content-between align-items-center mb-2">
        <strong>🛠️ Buenas Dev, así está hecha la web</strong>
        <button className="dev-overlay-close" onClick={() => setOpen(false)} aria-label="Cerrar">
          ✕
        </button>
      </div>
      {!data ? (
        <p>Cargando…</p>
      ) : (
        <div className="dev-overlay-content">
          {/* <section>
            <h4>App</h4>
            <p><b>{data.app.name}</b></p>
            <p>{data.app.description}</p>
          </section> */}
          <section>
            <h4>Stack</h4>
            <p>Frontend: {data.stack.frontend}</p>
            <p>Backend: {data.stack.backend}</p>
            <p>Base de datos: {data.stack.database}</p>
            <p>Hosting: {data.stack.hosting.join(", ")}</p>
          </section>
        
        </div>
      )}
    </div>
  );
}