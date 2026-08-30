import Link from 'next/link';
import Image from 'next/image';
import { FiExternalLink } from 'react-icons/fi';
import { Metadata } from 'next';
import { clientProjects, techCategories } from '../../data/clientProjects';

export const metadata: Metadata = {
  title: 'Desarrollo web | davidboo — Webs sencillitas pero bien hechas',
  description:
    'Hago webs sencillitas pero bien hechas: React, Next.js, diseño limpio y atención al detalle. Mira algunos proyectos y contáctame.',
  keywords: ['desarrollo web', 'freelance', 'Next.js', 'React', 'diseño web'],
};

const DesarrolloWebPage = () => {
  return (
    <div className="servicios-page">
      {/* Blob background — cubre toda la página */}
      <div className="servicios-blobs" aria-hidden="true">
        <div className="servicios-blob servicios-blob-1" />
        <div className="servicios-blob servicios-blob-2" />
        <div className="servicios-blob servicios-blob-3" />
      </div>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="servicios-hero">
        <div className="container servicios-hero-inner">
          <p className="servicios-section-subtitle">Desarrollo web · Freelance</p>
          <h1>
            Hago webs sencillitas
            <br />
            pero bien hechas.
          </h1>
          <p>
            Cualquier cosa que se te pase por la cabeza, te animo a que me la consultes, fácil,
            chungo, si me resulta interesante seguramente te diga que sí, el tema de la pasta lo
            hablamos si quieres también, no hay precios fijos, si me gusta mucho y no tienes €€€ a
            lo mejor te lo hago gratis. Si veo que yo solo no puedo y tienes presupuesto, conozco
            unos tipos que hacen unas webs bien chulas también.
          </p>
          <div className="servicios-hero-cta">
            <a href="mailto:tu@correo.com" className="btn btn-primary">
              <span>Cuéntame tu proyecto</span>
            </a>
            <a href="#portfolio" className="btn">
              <span>Ver trabajos</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ────────────────────────────────────────────── */}
      <section id="portfolio" className="servicios-section">
        <div className="container">
          <p className="servicios-section-subtitle">Proyectos de clientes</p>
          <h2 className="servicios-section-title">Algunos trabajos</h2>

          <div className="servicios-portfolio-grid">
            {clientProjects.map((project) => (
              <article key={project.id} className="glass-card servicios-portfolio-card">
                {/* Preview image / placeholder */}
                <div className="servicios-portfolio-image-wrap">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={`Captura de ${project.name}`}
                      width={560}
                      height={315}
                      className="servicios-portfolio-image"
                    />
                  ) : (
                    <div className="servicios-portfolio-placeholder" aria-hidden="true" />
                  )}
                </div>

                <div className="servicios-portfolio-card-header">
                  <h3 className="servicios-portfolio-card-title">{project.name}</h3>
                  <span className="servicios-portfolio-year">{project.year}</span>
                </div>

                <p className="servicios-portfolio-desc">{project.description}</p>

                <ul className="servicios-portfolio-tags">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <span className="tech-badge">{tag}</span>
                    </li>
                  ))}
                </ul>

                <div className="servicios-portfolio-footer">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="servicios-portfolio-link"
                  >
                    Ver proyecto <FiExternalLink />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ───────────────────────────────────────────── */}
      <section className="servicios-section">
        <div className="container">
          <p className="servicios-section-subtitle">Stack tecnológico</p>
          <h2 className="servicios-section-title">Con qué trabajo</h2>

          <div className="glass-card servicios-tech-category">
            <ul className="servicios-tech-badges">
              {techCategories.flatMap((category) =>
                category.techs.map((tech) => (
                  <li key={tech.name}>
                    <span
                      className="tech-badge"
                      style={{
                        background: tech.color,
                        color: tech.text ?? '#fff',
                      }}
                    >
                      {tech.name}
                    </span>
                  </li>
                )),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA / CONTACT ────────────────────────────────────────── */}
      <section className="servicios-cta">
        <div className="container">
          <div className="glass-card servicios-cta-inner">
            <h2>¿Tienes un proyecto en mente?</h2>
            <p>
              Cuéntame de qué va, qué necesitas y cuándo. Sin compromisos — si encaja, lo hacemos;
              si no, te digo dónde acudir.
            </p>
            <div className="servicios-cta-buttons">
              <a href="mailto:tu@correo.com" className="btn btn-primary">
                <span>Envíame un correo</span>
              </a>
              <Link href="/proyectos" className="btn">
                <span>Ver mis proyectos personales</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesarrolloWebPage;
