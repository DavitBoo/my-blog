// Funciones puras de formato + paletas visuales, portadas del prototipo de diseño.

import { VidaItem } from "../utils/vidaApi";

export type Tema = "claro" | "oscuro" | "survival";

export const PAL: Record<Tema, {
  mar: number; horizonte: number; cieloLuz: number; suelo: number; sol: number;
  relleno: number; tierra: number; tierraAlta: number; roca: number; arena: number;
  nube: number; marTop: number; marBot: number;
}> = {
  claro: { mar: 0x2f9fbf, horizonte: 0xcdeaf2, cieloLuz: 0xeafcff, suelo: 0x2f6f5f, sol: 0xfff6dd, relleno: 0x7fdce8, tierra: 0x3f9c72, tierraAlta: 0x6ac693, roca: 0x8899a2, arena: 0xf0e2b4, nube: 0xffffff, marTop: 210, marBot: 640 },
  oscuro: { mar: 0x0a4258, horizonte: 0x081720, cieloLuz: 0x2f7891, suelo: 0x0c2630, sol: 0xbfeaf5, relleno: 0x1c6c84, tierra: 0x1a6350, tierraAlta: 0x2b8a68, roca: 0x3f5561, arena: 0x9c8f63, nube: 0x2a5f73, marTop: 170, marBot: 600 },
  survival: { mar: 0x6b8d84, horizonte: 0xe4dfd1, cieloLuz: 0xfff4e2, suelo: 0x4a4436, sol: 0xffe9c2, relleno: 0xd9411e, tierra: 0x58692f, tierraAlta: 0x7d8c4a, roca: 0x8a7f6b, arena: 0xdccca4, nube: 0xf7f3e6, marTop: 200, marBot: 620 },
};

export const COL: Record<string, number> = {
  proyectos: 0x04adbf,
  viajes: 0xd9cb04,
  trabajos: 0x0e6a94,
  estudios: 0x0388a6,
  idiomas: 0x04bfbf,
  musica: 0xe0562b,
  lecturas: 0xb08d4a,
};

export const AMBITOS: Record<string, string> = {
  lutheria: "Lutería",
  desarrollo: "Desarrollo",
  electronica: "Electrónica",
  carpinteria: "Carpintería",
  comunidad: "Comunidad",
  audiovisual: "Audiovisual",
  otro: "Otro",
};

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export const fmtFecha = (f: string | null, prec: string): string => {
  if (!f) return "";
  const p = f.slice(0, 10).split("-");
  if (prec === "dia" && p[2]) return `${+p[2]} ${MESES[+p[1] - 1]} ${p[0]}`;
  if ((prec === "mes" || prec === "dia") && p[1]) return `${MESES[+p[1] - 1]} ${p[0]}`;
  return p[0];
};

export const fmtRango = (it: Pick<VidaItem, "fechaInicio" | "fechaFin" | "precisionFecha" | "enCurso">): string => {
  const a = fmtFecha(it.fechaInicio, it.precisionFecha);
  if (it.enCurso) return a ? `${a} — presente` : "en curso";
  const b = fmtFecha(it.fechaFin, it.precisionFecha);
  if (b && b !== a) return `${a} — ${b}`;
  return a || "sin fecha";
};

export const humaniza = (k: string): string => k.replace(/_/g, " ");
