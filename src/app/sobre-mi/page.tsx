// app/sobre-mi/page.tsx — página/blog personal, sin Tailwind y compatible con tu CSS + three.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./sobre-mi.module.css"; // reutiliza tus clases existentes
import TimelineThreeScene from "./TimelineThreeScene";

// ————————————————————————————————————————————————
// Tipos y datos (reutilizamos tu dataset de eventos)
// ————————————————————————————————————————————————

type TagType =
  | "trabajo"
  | "estudios"
  | "idioma"
  | "idiomas"
  | "viaje"
  | "lugar-unico"
  | "proyecto"
  | "momento"
  | "hobby"
  | "musica"
  | "skills"
  | "voluntario";

type Tag = { label: string; type: TagType };

type Event = {
  year: string;
  title: string;
  description: string;
  tags: Tag[];
};

type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  summary: string;
  tags: string[];
};

// ⚠️ Estos posts son placeholders para la demo visual. Sustitúyelos por tu fuente real (MDX/Markdown/DB).
const posts: Post[] = [
  {
    slug: "/blog/threejs-timeline",
    title: "Jugueteando con Three.js para una timeline viva",
    date: "2025-03-14",
    summary: "Apuntes de cómo acabé mezclando escenas 3D con scroll y estados de React para contar historias sin aburrir.",
    tags: ["three.js", "react", "ux"],
  },
  {
    slug: "/blog/montana-sin-prisa",
    title: "Montaña, sin prisa (y por qué eso mejora mi código)",
    date: "2025-05-02",
    summary: "Ritmos, decisiones y revisar el parte: la transferencia de la montaña al desarrollo.",
    tags: ["montaña", "productividad"],
  },
  {
    slug: "/blog/portugues-canciones",
    title: "Aprender portugués con canciones",
    date: "2025-06-21",
    summary: "Pequeño método casero para llegar a conversaciones reales usando letras y acordes.",
    tags: ["idiomas", "música"],
  },
];

// Dataset original (pegado) — si prefieres, impórtalo desde otro fichero.
const events: Event[] = [
  {
    year: "2009",
    title: "Etapa ...",
    description: " ",
    tags: [
      { label: "Dolls", type: "musica" },
      { label: "Lesión de muñeca", type: "momento" },
      { label: "Luthería", type: "hobby" },
      { label: "Ingeniería Electrónica", type: "estudios" },
    ],
  },
  {
    year: "2010",
    title: "Primeros Pasos",
    description: "",
    tags: [
      { label: "Profesor de guitarra", type: "trabajo" },
      { label: "Desarrollo de productos electrónicos", type: "estudios" },
      { label: "Montaña", type: "hobby" },
    ],
  },
  {
    year: "2011",
    title: "Primeros Pasos",
    description: "",
    tags: [
      { label: "Desarrollo de productos electrónicos", type: "estudios" },
      { label: "Inglés", type: "idiomas" },
      { label: "Me recupero de la muñeca", type: "momento" },
      { label: "Descubro el gimnasio", type: "momento" },
      { label: "Holanda", type: "viaje" },
      { label: "Montaña", type: "hobby" },
      { label: "Ánima", type: "musica" },
    ],
  },
  {
    year: "2012",
    title: "Primeros Pasos",
    description: "",
    tags: [
      { label: "Göttingen", type: "lugar-unico" },
      { label: "Vistrom GmbH", type: "trabajo" },
      { label: "Alemania", type: "viaje" },
      { label: "Austria", type: "viaje" },
      { label: "Republica checa", type: "viaje" },
      { label: "Profesor de guitarra", type: "trabajo" },
      { label: "Carpintero", type: "trabajo" },
      { label: "Montaña", type: "hobby" },
      { label: "Ingeniería Electronica industrial y Automática", type: "estudios" },
      { label: "Ánima", type: "musica" },
    ],
  },
  {
    year: "2013",
    title: "Primeros Pasos",
    description:
      "Comencé mi aventura en el mundo del desarrollo web. Mis primeros proyectos fueron pequeños sitios estáticos, pero ya mostraba pasión por crear experiencias digitales únicas.",
    tags: [
      { label: "Camino de Santiago", type: "viaje" },
      { label: "Profesor de guitarra", type: "trabajo" },
      { label: "Carpintero", type: "trabajo" },
      { label: "Montaña", type: "hobby" },
      { label: "Ingeniería Electronica industrial y Automática", type: "estudios" },
      { label: "Ánima", type: "musica" },
      { label: "Castellano", type: "idioma" },
      { label: "Euskera", type: "idioma" },
    ],
  },
  {
    year: "2014",
    title: "Primeros Pasos",
    description:
      "Comencé mi aventura en el mundo del desarrollo web. Mis primeros proyectos fueron pequeños sitios estáticos, pero ya mostraba pasión por crear experiencias digitales únicas.",
    tags: [
      { label: "Camino de Santiago", type: "viaje" },
      { label: "Profesor de guitarra", type: "trabajo" },
      { label: "Carpintero", type: "trabajo" },
      { label: "Lesión de hombro", type: "momento" },
      { label: "Ingeniería Electronica industrial y Automática", type: "estudios" },
    ],
  },
  {
    year: "2015",
    title: "Primeros Pasos",
    description:
      "Comencé mi aventura en el mundo del desarrollo web. Mis primeros proyectos fueron pequeños sitios estáticos, pero ya mostraba pasión por crear experiencias digitales únicas.",
    tags: [
      { label: "Inglés", type: "idioma" },
      { label: "Inglaterra", type: "viaje" },
      { label: "Hungría", type: "viaje" },
      { label: "Rumanía", type: "viaje" },
      { label: "Bulgaria", type: "viaje" },
      { label: "Macedonia", type: "viaje" },
      { label: "Serbia", type: "viaje" },
      { label: "Croacia", type: "viaje" },
      { label: "Slovenia", type: "viaje" },
      { label: "Italia", type: "viaje" },
      { label: "Francia", type: "viaje" },
      { label: "Profesor de guitarra", type: "trabajo" },
      { label: "Carpintero", type: "trabajo" },
      { label: "Calistenia", type: "hobby" },
      { label: "Ingeniería Electronica industrial y Automática", type: "estudios" },
      { label: "TEDx VG", type: "voluntario" },
    ],
  },
  {
    year: "2016",
    title: "Primeros Pasos",
    description:
      "Comencé mi aventura en el mundo del desarrollo web. Mis primeros proyectos fueron pequeños sitios estáticos, pero ya mostraba pasión por crear experiencias digitales únicas.",
    tags: [
      { label: "Inglés", type: "idioma" },
      { label: "Polonia", type: "viaje" },
      { label: "Ucrania", type: "viaje" },
      { label: "Moldavia", type: "viaje" },
      { label: "Rumania", type: "viaje" },
      { label: "Hungría", type: "viaje" },
      { label: "Slovakia", type: "viaje" },
      { label: "Austria", type: "viaje" },
      { label: "Carpintero", type: "trabajo" },
      { label: "Talgo: ingeniero dpto. Puesta en servicio", type: "trabajo" },
      { label: "Ingeniería Electronica industrial y Automática", type: "estudios" },
      { label: "TEDx VG", type: "voluntario" },
    ],
  },
  {
    year: "2017",
    title: "Primeros Pasos",
    description:
      "Comencé mi aventura en el mundo del desarrollo web. Mis primeros proyectos fueron pequeños sitios estáticos, pero ya mostraba pasión por crear experiencias digitales únicas.",
    tags: [
      { label: "Inglés", type: "idioma" },
      { label: "Talgo: ingeniero dpto. Puesta en servicio", type: "trabajo" },
      { label: "Ingeniería Electronica industrial y Automática", type: "estudios" },
      { label: "Old Time Skeletors", type: "musica" },
      { label: "TEDx VG", type: "voluntario" },
    ],
  },
  {
    year: "2018",
    title: "Primeros Pasos",
    description:
      "Comencé mi aventura en el mundo del desarrollo web. Mis primeros proyectos fueron pequeños sitios estáticos, pero ya mostraba pasión por crear experiencias digitales únicas.",
    tags: [
      { label: "Inglés", type: "idioma" },
      { label: "Italiano", type: "idioma" },
      { label: "Francia", type: "viaje" },
      { label: "Italia", type: "viaje" },
      { label: "Albania", type: "viaje" },
      { label: "Montenegro", type: "viaje" },
      { label: "Bosnia", type: "viaje" },
      { label: "Croacia", type: "viaje" },
      { label: "Alemania", type: "viaje" },
      { label: "Talgo: ingeniero dpto. Puesta en servicio", type: "trabajo" },
      { label: "Lesión de muñeca", type: "momento" },
    ],
  },
  {
    year: "2019",
    title: "Aprendizaje Intensivo",
    description:
      "Me sumergí en el mundo del desarrollo frontend. Aprendí React, mejoré mis habilidades en JavaScript y comencé a trabajar en proyectos más complejos. También empecé a perfeccionar mi inglés.",
    tags: [
      { label: "Italiano", type: "idioma" },
      { label: "Aleman", type: "idioma" },
      { label: "Turquía", type: "viaje" },
      { label: "Grecia", type: "viaje" },
      { label: "Profesor Academia Salburua", type: "trabajo" },
      { label: "Language Exchange Vitoria", type: "proyecto" },
      { label: "TEDx VG", type: "voluntario" },
      { label: "Old Time Skeletors", type: "musica" },
      { label: "Programación", type: "hobby" },

    ],
  },
  {
    year: "2020",
    title: "Primer Trabajo Profesional",
    description:
      "Conseguí mi primer empleo como desarrollador junior en una startup tecnológica. Trabajé en el desarrollo de aplicaciones web modernas y aprendí sobre metodologías ágiles.",
    tags: [
      { label: "Griego moderno", type: "idioma" },
      { label: "Furgoneta hasta grecia", type: "viaje" },
      { label: "Pandemia", type: "momento" },
      { label: "Estados Unidos", type: "viaje" },
      { label: "Profesor Academia Salburua", type: "trabajo" },
      { label: "Language Exchange Vitoria", type: "proyecto" },
      { label: "Máster Marketing Digital", type: "estudios" },
      { label: "Desarrollo web", type: "skills" },
      { label: "Old Time Skeletors", type: "musica" },
    ],
  },
  {
    year: "2021",
    title: "Expansión de Conocimientos",
    description:
      "Me especialicé en tecnologías backend y bases de datos. Aprendí Python, trabajé con APIs REST y comencé a entender la arquitectura de software a gran escala.",
    tags: [
      { label: "Griego moderno", type: "idioma" },
      { label: "SDI Digital Group", type: "trabajo" },
      { label: "Máster Marketing Digital", type: "estudios" },
      { label: "HTML", type: "skills" },
      { label: "CSS", type: "skills" },
      { label: "JavaScript", type: "skills" },
      { label: "Wordpress", type: "skills" },
      { label: "TEDx VG", type: "voluntario" },
    ],
  },
  {
    year: "2022",
    title: "Liderazgo de Equipo",
    description:
      "Ascendí a desarrollador senior y comencé a liderar un pequeño equipo. Implementé mejores prácticas de desarrollo y mentoricé a desarrolladores junior.",
    tags: [
      { label: "Griego moderno", type: "idioma" },
      { label: "IDEC S.A.", type: "trabajo" },
      { label: "Chipre", type: "viaje" },
      { label: "Atenas", type: "lugar-unico" },
    ],
  },
  {
    year: "2023",
    title: "Proyectos Freelance",
    description:
      "Decidí aventurarme como freelancer, trabajando con clientes internacionales. Desarrollé aplicaciones web complejas y mejoré significativamente mi inglés a nivel C1.",
    tags: [
      { label: "Griego moderno", type: "idioma" },
      { label: "Caronte Studio", type: "trabajo" },
      { label: "React", type: "skills" },
      { label: "Express", type: "skills" },
      { label: "PHP", type: "skills" },
      { label: "TEDx VG", type: "voluntario" },
      { label: "Guitarras eléctricas Serie Grecia", type:"proyecto"}
    ],
  },
  {
    year: "2024",
    title: "Presente",
    description: "1",
    tags: [
      { label: "Griego moderno", type: "idioma" },
      { label: "Dinamarca", type: "viaje" },
      { label: "Islandia", type: "viaje" },
      { label: "Caronte Studio", type: "trabajo" },
      { label: "Montaña", type: "hobby" },
      { label: "NextJS", type: "skills" },
      { label: "TEDx VG", type: "voluntario" },
      { label: "Guitarras eléctricas Serie Grecia", type:"proyecto"}
    ],
  },
  {
    year: "2025",
    title: "Presente",
    description:
      `Este año por lo pronto he estado en Brasil, he empezado a aprender portugués, he hecho mucho monte y estoy montando un dúo de folk con un colega. Sigo leyendo, tocando la guitarra y entrenando al aire libre.`, 
    tags: [
      { label: "Brasil", type: "viaje" },
      { label: "Portugués", type: "idioma" },
      { label: "Caronte Studio", type: "trabajo" },
      { label: "TEDx VG", type: "voluntario" },
      { label: "Guitarras eléctricas Serie Grecia", type:"proyecto"}
    ],
  },
];

// ————————————————————————————————————————————————
// Utilidades: agrupación y derivaciones para un blog personal
// ————————————————————————————————————————————————

const normalizaTipo = (t: TagType) => (t === "idiomas" ? "idioma" : t);

function getStats(evs: Event[]) {
  const places = new Set<string>();
  const languages = new Set<string>();
  const companies = new Set<string>();
  const passions = new Set<string>();
  let tedx = 0;

  evs.forEach((e) => {
    e.tags.forEach((t) => {
      const type = normalizaTipo(t.type);
      if (type === "viaje" || type === "lugar-unico") places.add(t.label);
      if (type === "idioma") languages.add(t.label);
      if (type === "trabajo") companies.add(t.label);
      if (type === "hobby" || type === "musica") passions.add(t.label);
      if (type === "proyecto" && t.label.toLowerCase().includes("tedx")) tedx += 1;
    });
  });

  const years = evs.map((e) => parseInt(e.year, 10)).filter((n) => !isNaN(n));
  const minY = Math.min(...years);
  const maxY = Math.max(...years);

  return {
    lugares: places.size,
    idiomas: languages.size,
    empresas: companies.size,
    pasiones: passions.size,
    tedx,
    anios: maxY - minY + 1,
  };
}

function deriveProjects(evs: Event[]) {
  const map = new Map<string, { label: string; kind: "proyecto" | "trabajo" | "voluntario"; years: number[] }>();
  evs.forEach((e) => {
    e.tags.forEach((t) => {
      const kind = normalizaTipo(t.type);
      if (kind === "proyecto" || kind === "trabajo" || kind === "voluntario") {
        const y = parseInt(e.year, 10);
        if (!map.has(t.label)) map.set(t.label, { label: t.label, kind, years: [] });
        if (!isNaN(y)) map.get(t.label)!.years.push(y);
      }
    });
  });
  const items = Array.from(map.values()).map((x) => ({
    ...x,
    from: Math.min(...x.years),
    to: Math.max(...x.years),
    span: new Set(x.years).size,
  }));
  items.sort((a, b) => b.span - a.span);
  return items;
}

const kindLabels = {
  proyecto: "Proyecto",
  voluntario: "Voluntario",
  trabajo: "Trabajo"
};

function collectThemes(evs: Event[]) {
  const themes: Record<string, string[]> = {
    "Ingeniería": [],
    "Música": [],
    "Montaña": [],
    "Idiomas": [],
    "Viajes": [],
  };
  evs.forEach((e) => {
    e.tags.forEach((t) => {
      const type = normalizaTipo(t.type);
      if (type === "estudios" || t.label.toLowerCase().includes("ingenier")) themes["Ingeniería"].push(t.label);
      if (type === "musica") themes["Música"].push(t.label);
      if (type === "hobby" && t.label.toLowerCase().includes("mont")) themes["Montaña"].push(t.label);
      if (type === "idioma") themes["Idiomas"].push(t.label);
      if (type === "viaje" || type === "lugar-unico") themes["Viajes"].push(t.label);
    });
  });
  return themes;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

// ————————————————————————————————————————————————
// Componentes UI (sin frameworks CSS)
// ————————————————————————————————————————————————

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-font-tertiary)" }}>
      {children}
    </div>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className={styles.timelineCard} style={{ textAlign: "center" }}>
      <div style={{ fontSize: "2rem", fontWeight: 800 }}>{value}</div>
      <div style={{ marginTop: 6, fontSize: "0.9rem", color: "var(--color-font-secondary)" }}>{label}</div>
    </div>
  );
}

function PostCard({ p }: { p: Post }) {
  return (
    <a href={p.slug} className={styles.timelineCard} style={{ display: "block", textDecoration: "none" }}>
      <div style={{ fontSize: "0.85rem", color: "var(--color-font-tertiary)", marginBottom: 6 }}>{formatDate(p.date)}</div>
      <h3 style={{ fontSize: "1.15rem", margin: 0 }}>{p.title}</h3>
      <p style={{ marginTop: 6, marginBottom: 8 }}>{p.summary}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {p.tags.map((t) => (
          <span key={t} className={`${styles.tag} ${styles["tag-proyecto"]}`}>{t}</span>
        ))}
      </div>
    </a>
  );
}

function Section({ id, title, children, kicker }: { id: string; title: string; children: React.ReactNode; kicker?: string }) {
  return (
    <section id={id} data-section className={styles.timelineSection}>
      <div className="container">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h2 className="mb-2" style={{ fontSize: "2rem" }}>{title}</h2>
        <div>{children}</div>
      </div>
    </section>
  );
}

// ————————————————————————————————————————————————
// Página principal
// ————————————————————————————————————————————————

const sectionsIds = ["now", "posts", "proyectos", "temas", "contacto"];

export default function Page() {
  const stats = useMemo(() => getStats(events), []);
  const projects = useMemo(() => deriveProjects(events), []);
  const themes = useMemo(() => collectThemes(events), []);
  const nowText = useMemo(() => events.find((e) => e.year === "2025")?.description || "—", []);

  const [active, setActive] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const els = sectionsIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = sectionsIds.indexOf(visible.target.id);
          if (idx !== -1) setActive(idx);
        }
      },
      { root: null, rootMargin: "-20% 0px -60% 0px", threshold: [0.2, 0.6, 1] }
    );

    els.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const handleDotClick = (idx: number) => {
    const id = sectionsIds[idx];
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sobre-mi">
      {/* Fondo/hero con three.js */}
      <TimelineThreeScene />

      {/* Indicador de scroll por secciones */}
      <div className={styles.scrollIndicator}>
        {sectionsIds.map((_, i) => (
          <div
            key={i}
            className={`scrollDot ${styles.scrollDot} ${i === active ? styles.active : ""}`}
            data-dot
            onClick={() => handleDotClick(i)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>

      {/* Contenido */}
      <div id="container" className={`container ${styles.container}`}>
        <div id="content" className={styles.content} style={{ pointerEvents: "auto" }}>
          {/* HERO */}
          <div className="container" style={{ padding: "6rem 0 2rem" }}>
            <div className={`mw-48 ${styles.introText}`}>
              <h1 className="mb-2">
                Este es mi sitio personal: escribo, toqueteo proyectos y comparto lo que aprendo.
              </h1>
              <p className="mb-8">
                No te estoy vendiendo nada. Si algo de aquí te sirve, ya habrá tiempo de hablar. Mientras tanto, <span className="highlight-2">blog</span>, <span className="highlight-2">proyectos</span> y alguna que otra <span className="highlight-2">idea a medio hacer</span>.
              </p>
            </div>
          </div>

          {/* NOW / AHORA */}
          <Section id="now" title=" " kicker="/now" >
            <div className={styles.timelineCard}>
              <p style={{ margin: 0 }}>{nowText}</p>
            </div>
            <div className="d-flex gap-4 text-start" style={{ flexWrap: "wrap", marginTop: 12 }}>
              <Stat value={`${stats.idiomas}`} label="idiomas que voy tocando" />
              <Stat value={`${stats.pasiones}`} label="obsesiones activas" />
              <Stat value={`${stats.lugares}`} label="lugares que me han movido" />
            </div>
          </Section>

          {/* POSTS RECIENTES */}
          <Section id="posts" title="Notas recientes" kicker="Blog">
            <div className="d-flex gap-4" style={{ flexWrap: "wrap" }}>
              {posts.map((p) => (
                <PostCard key={p.slug} p={p} />
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <a href="/blog" className="btn btn-primary">Ver archivo completo</a>
            </div>
          </Section>



          {/* PROYECTOS (derivados tags) */}
          <Section id="proyectos" title="Proyectos y curros" kicker="Selección">
            <div className="d-flex gap-4" style={{ flexWrap: "wrap" }}>
              {projects.slice(0, 15).map((r) => (
                <div key={r.label} className={styles.timelineCard} style={{ flex: "1 1 300px" }}>
                  <small className="highlight-2">{kindLabels[r.kind] || r.kind}</small>
                  <h3 className="mb-2" style={{ fontSize: "1.2rem" }}>{r.label}</h3>
                  <p style={{ marginBottom: 0 }}>
                    Presencia en {r.span} {r.span === 1 ? "año" : "años"} entre {r.from}–{r.to}.
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* TEMAS */}
          <Section id="temas" title="Temas que aparecen mucho" kicker="Mapas" >
            <div className="d-flex gap-4" style={{ flexWrap: "wrap" }}>
              {Object.entries(themes).map(([name, items]) => (
                <div key={name} className={styles.timelineCard} style={{ flex: "1 1 280px" }}>
                  <h3 className="mb-4" style={{ fontSize: "1.25rem" }}>{name}</h3>
                  <ul className="label-list" style={{ marginBottom: 0 }}>
                    {Array.from(new Set(items)).slice(0, 12).map((x) => (
                      <li key={x} className="label-list-item">{x}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* CONTACTO SUAVE */}
          <Section id="contacto" title="Si te apetece charlar" kicker="Puertas abiertas">
            <div className={styles.timelineCard}>
              <p style={{ marginBottom: 12 }}>
                Me puedes escribir para comentar un post, proponer una idea o simplemente saludar.
              </p>
              <div className="d-flex gap-4" style={{ flexWrap: "wrap" }}>
                <a href="mailto:yo@tudominio.com" className="btn btn-primary"><span>Enviar correo</span></a>
                <a href="/blog" className="btn"><span>Ir al blog</span></a>
              </div>
            </div>
            <p className="mb-1" style={{ color: "var(--color-font-secondary)", marginTop: 16 }}>
              *Si algún día ofrezco algo más concreto, lo pondré aquí. De momento, a disfrutar del proceso.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
