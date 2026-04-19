import { fetchProjectBySlug } from "../../utils/api";
import BackButton from "../../components/BackButton";
import ProcessedContent from "@/app/components/ProcessedContent";
import { Metadata } from "next";

import { format } from "date-fns";
import { decode } from "html-entities";
import { es } from "date-fns/locale";

import { FaGlasses, FaEye, FaFolder } from "react-icons/fa";

import Image from "next/image";

type ProjectProps = {
  params: Promise<{ slug: string }>;
};

// Función para generar metadatos dinámicos SEO
export async function generateMetadata(props: ProjectProps): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Proyecto no encontrado',
      description: 'El proyecto que buscas no está disponible.',
    };
  }

  const metaTitle = project.title;
  const metaDescription = decode(project.content).replace(/<[^>]*>/g, "").substring(0, 160) + "...";
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://my-blog-omega-pearl.vercel.app'}/proyectos/${project.slug}`;
  const socialImage = project.coverUrl || '/placeholder.jpg';

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: project.category?.name || "Proyectos",
    authors: [{ name: 'david' }], 
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'Diogenes Brain - Proyectos', 
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      locale: 'es_ES',
      type: 'article',
      publishedTime: project.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [socialImage],
    },
  };
}

const ProjectPage = async (props: ProjectProps) => {
  const { slug } = await props.params;
  const project = await fetchProjectBySlug(slug);

  if (!project) {
    return (
      <div className="no-article" aria-live="assertive">
        No se ha encontrado este proyecto
      </div>
    );
  }

  const decodedString = decode(project?.content);
  
  const readingTime = () => {
    const wpm = 250;
    const words = decodedString.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
  };

  return (
    <main className="article-page">
      <div className="container">
        {project.category && (
          <ul className="label-list">
            <li className="label-list-item">
              <span style={{display: 'flex', alignItems: 'center', gap: '0.2rem'}}><FaFolder /> {project.category.name}</span>
            </li>
          </ul>
        )}
        
        <h1 className="article-title text-center">{project.title}</h1>
        <div className="d-flex align-items-center justify-content-center gap-6">
          <div className="reading-time">
            <FaGlasses /> {readingTime()} min
          </div>
          <header className="article-header" aria-label="Article Header">
            <div className="timestamp">
              <time>{format(new Date(project.createdAt), "EEEE, dd MMMM yyyy", { locale: es })}</time>
            </div>
          </header>
          <div className="views-count d-flex align-items-center gap-2">
            <FaEye /> {project.views} visitas
          </div>
        </div>
        <Image src={project.coverUrl ? project.coverUrl : '/placeholder.jpg'}  alt={project.title} width={800} height={500} className="featured-image" />

        <ProcessedContent html={decodedString} />
        
        <BackButton />
        <small>Publicado el {new Date(project.createdAt).toLocaleDateString()}</small>
      </div>
    </main>
  );
};

export default ProjectPage;
