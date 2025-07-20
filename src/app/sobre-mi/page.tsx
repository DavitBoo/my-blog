// /sobre-mi/-page.tsx

"use client";

import styles from "./sobre-mi.module.css";
import TimelineThreeScene from "./TimelineThreeScene";



const Page = () => {
  return (
    <div className="sobre-mi">
        <div id="container" className={`container ${styles.container}`}>
          <TimelineThreeScene/>
          <div className={styles.introText}>
            <h1>Mi Trayectoria</h1>
            <p>Desliza para descubrir mi historia</p>
          </div>
          <div className={styles.scrollIndicator}>
            <div className={`scrollDot ${styles.scrollDot} ${styles.active}`}></div>
            <div className={`${styles.scrollDot}`}></div>
            <div className={`${styles.scrollDot}`}></div>
            <div className={`${styles.scrollDot}`}></div>
            <div className={`${styles.scrollDot}`}></div>
            <div className={`${styles.scrollDot}`}></div>
            <div className={`${styles.scrollDot}`}></div>
          </div>
          <div id="content" className={styles.content}>
            {[
              {
                year: '2018',
                title: 'Primeros Pasos',
                description:
                  'Comencé mi aventura en el mundo del desarrollo web. Mis primeros proyectos fueron pequeños sitios estáticos, pero ya mostraba pasión por crear experiencias digitales únicas.',
                tags: ['HTML/CSS', 'JavaScript', 'Barcelona'],
              },
              {
                year: '2019',
                title: 'Aprendizaje Intensivo',
                description:
                  'Me sumergí en el mundo del desarrollo frontend. Aprendí React, mejoré mis habilidades en JavaScript y comencé a trabajar en proyectos más complejos. También empecé a perfeccionar mi inglés.',
                tags: ['React', 'Node.js', 'Inglés B2', 'Madrid'],
              },
              {
                year: '2020',
                title: 'Primer Trabajo Profesional',
                description:
                  'Conseguí mi primer empleo como desarrollador junior en una startup tecnológica. Trabajé en el desarrollo de aplicaciones web modernas y aprendí sobre metodologías ágiles.',
                tags: ['Startup', 'Scrum', 'Vue.js', 'Trabajo Remoto'],
              },
              {
                year: '2021',
                title: 'Expansión de Conocimientos',
                description:
                  'Me especialicé en tecnologías backend y bases de datos. Aprendí Python, trabajé con APIs REST y comencé a entender la arquitectura de software a gran escala.',
                tags: ['Python', 'PostgreSQL', 'API REST', 'Docker'],
              },
              {
                year: '2022',
                title: 'Liderazgo de Equipo',
                description:
                  'Ascendí a desarrollador senior y comencé a liderar un pequeño equipo. Implementé mejores prácticas de desarrollo y mentoricé a desarrolladores junior.',
                tags: ['Team Lead', 'Mentoring', 'AWS', 'DevOps'],
              },
              {
                year: '2023',
                title: 'Proyectos Freelance',
                description:
                  'Decidí aventurarme como freelancer, trabajando con clientes internacionales. Desarrollé aplicaciones web complejas y mejoré significativamente mi inglés a nivel C1.',
                tags: ['Freelance', 'Clientes Internacionales', 'Inglés C1', 'Three.js'],
              },
              {
                year: '2024',
                title: 'Presente',
                description:
                  'Actualmente trabajo como desarrollador full-stack independiente, especializado en crear experiencias web inmersivas con tecnologías 3D. Vivo en Madrid y colaboro con equipos de todo el mundo.',
                tags: ['Full-stack', 'WebGL', 'Three.js', 'Madrid', 'Remoto'],
              },
            ].map((item, index) => (
              <section
                key={item.year}
                className={`timelineSection ${styles.timelineSection} ${index === 0 ? styles.active : ''}`}
                style={{ top: `${index * 100}vh` }}
              >
                <div className={styles.timelineCard}>
                  <div className={styles.year}>{item.year}</div>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.description}>{item.description}</div>
                  <div className={styles.tags}>
                    {item.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
    </div>
  );
};

export default Page;
