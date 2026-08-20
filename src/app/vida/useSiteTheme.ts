"use client";

import { useEffect, useState } from "react";
import { Tema } from "./vidaFormat";

const claseATema = (): Tema => {
  if (typeof document === "undefined") return "oscuro";
  const cl = document.documentElement.classList;
  if (cl.contains("survival")) return "survival";
  if (cl.contains("dark")) return "oscuro";
  return "claro";
};

// Sincroniza el tema de la escena con el selector de tema ya existente en Header.tsx
// (que aplica las clases "dark"/"survival" sobre <html>), sin tener que tocarlo.
export const useSiteTheme = (): Tema => {
  const [tema, setTema] = useState<Tema>(claseATema);

  useEffect(() => {
    setTema(claseATema());
    const observer = new MutationObserver(() => setTema(claseATema()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return tema;
};
