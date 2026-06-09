export interface IClientProject {
  id: number;
  name: string;
  description: string;
  url: string;
  tags: string[];
  year: string;
}

export interface ITechCategory {
  id: string;
  title: string;
  techs: string[];
}

// Añade nuevos proyectos aquí — el grid se adapta automáticamente
export const clientProjects: IClientProject[] = [
  {
    id: 1,
    name: "Ejemplo: Web Corporativa",
    description:
      "Sitio web corporativo con presentación de servicios, galería de trabajos y formulario de contacto integrado.",
    url: "https://ejemplo.com",
    tags: ["Next.js", "TypeScript", "CSS"],
    year: "2024",
  },
  {
    id: 2,
    name: "Ejemplo: Tienda Online",
    description:
      "Tienda e-commerce con catálogo de productos, carrito de compra y pasarela de pago integrada.",
    url: "https://ejemplo.com",
    tags: ["React", "WooCommerce", "PHP"],
    year: "2024",
  },
  {
    id: 3,
    name: "Ejemplo: Portfolio Artístico",
    description:
      "Portfolio visual para artista con galería fotográfica de alta resolución y sección de contacto.",
    url: "https://ejemplo.com",
    tags: ["Next.js", "Cloudinary", "CSS"],
    year: "2023",
  },
  {
    id: 4,
    name: "Ejemplo: Landing Page",
    description:
      "Página de aterrizaje optimizada para conversión, con animaciones, testimonios y CTA claros.",
    url: "https://ejemplo.com",
    tags: ["HTML", "CSS", "JavaScript"],
    year: "2023",
  },
];

export const techCategories: ITechCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    techs: ["React", "Next.js 14", "TypeScript", "HTML5", "CSS3", "JavaScript"],
  },
  {
    id: "backend",
    title: "Backend",
    techs: ["Node.js", "Express", "PHP", "REST APIs"],
  },
  {
    id: "cms",
    title: "CMS / Plataformas",
    techs: ["WordPress", "WooCommerce", "Strapi"],
  },
  {
    id: "tools",
    title: "Herramientas",
    techs: ["Git", "Vercel", "Railway", "Figma", "Cloudinary"],
  },
  {
    id: "databases",
    title: "Bases de datos",
    techs: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
  },
];
