export interface IClientProject {
  id: number;
  name: string;
  description: string;
  url: string;
  tags: string[];
  year: string;
  image?: string; // ruta relativa a /public/, ej: "/images/portfolio/proyecto1.png"
}

export interface ITech {
  name: string;
  color: string;   // hex background del badge (brand color)
  text?: string;   // hex texto — omitir para blanco; usar '#1a1a1a' si el fondo es claro
}

export interface ITechCategory {
  id: string;
  title: string;
  techs: ITech[];
}

// Añade nuevos proyectos aquí — el grid se adapta automáticamente.
// Para añadir una captura: pon el fichero en /public/images/portfolio/ y
// añade image: "/images/portfolio/nombre.png" al proyecto correspondiente.
export const clientProjects: IClientProject[] = [
  {
    id: 1,
    name: "Ejemplo: Web Corporativa",
    description:
      "Sitio web corporativo con presentación de servicios, galería de trabajos y formulario de contacto integrado.",
    url: "https://ejemplo.com",
    tags: ["Next.js", "TypeScript", "CSS"],
    year: "2024",
    // image: "/images/portfolio/corporativa.png",
  },
  {
    id: 2,
    name: "Ejemplo: Tienda Online",
    description:
      "Tienda e-commerce con catálogo de productos, carrito de compra y pasarela de pago integrada.",
    url: "https://ejemplo.com",
    tags: ["React", "WooCommerce", "PHP"],
    year: "2024",
    // image: "/images/portfolio/tienda.png",
  },
  {
    id: 3,
    name: "Ejemplo: Portfolio Artístico",
    description:
      "Portfolio visual para artista con galería fotográfica de alta resolución y sección de contacto.",
    url: "https://ejemplo.com",
    tags: ["Next.js", "Cloudinary", "CSS"],
    year: "2023",
    // image: "/images/portfolio/portfolio.png",
  },
  {
    id: 4,
    name: "Ejemplo: Landing Page",
    description:
      "Página de aterrizaje optimizada para conversión, con animaciones, testimonios y CTA claros.",
    url: "https://ejemplo.com",
    tags: ["HTML", "CSS", "JavaScript"],
    year: "2023",
    // image: "/images/portfolio/landing.png",
  },
];

export const techCategories: ITechCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    techs: [
      { name: "HTML5",      color: "#E34F26" },
      { name: "CSS3",       color: "#1572B6" },
      { name: "JavaScript", color: "#F7DF1E", text: "#1a1a1a" },
      { name: "TypeScript", color: "#3178C6" },
      { name: "React.js",   color: "#61DAFB", text: "#1a1a1a" },
      { name: "Next.js",    color: "#000000" },
      { name: "Bootstrap",  color: "#7952B3" },
      { name: "Three.js",   color: "#049EF4" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    techs: [
      { name: "Node.js",    color: "#339933" },
      { name: "Express.js", color: "#404040" },
      { name: "PHP",        color: "#777BB4" },
      { name: "Python",     color: "#3776AB" },
    ],
  },
  {
    id: "databases",
    title: "Bases de datos",
    techs: [
      { name: "SQL / Prisma", color: "#2D3748" },
      { name: "MongoDB",      color: "#47A248" },
      { name: "Git",          color: "#F05032" },
      { name: "Docker",       color: "#2496ED" },
      { name: "Linux",        color: "#FCC624", text: "#1a1a1a" },
    ],
  },
  {
    id: "cms",
    title: "CMS, Diseño & Marketing",
    techs: [
      { name: "WordPress",    color: "#21759B" },
      { name: "Technical SEO", color: "#4CAF50" },
      { name: "Figma",        color: "#F24E1E" },
      { name: "Photoshop",    color: "#31A8FF" },
    ],
  },
];
