'use client';

import { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import {
  IoBook,
  IoGlobe,
  IoMusicalNotes,
  IoCode,
  IoFitness,
  IoPlay,
  IoFlask,
} from 'react-icons/io5';
import { FaMountain } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

interface NowData {
  reading: {
    title: string;
    author: string;
    progress: number;
    cover: string;
  };
  language: {
    name: string;
    level: string;
    platform: string;
  };
  music: {
    song: string;
    artist: string;
    youtubeUrl: string;
    spotifyUrl?: string;
  };
  project: {
    name: string;
    description: string;
    skills: string[];
    progress: number;
  };
  learning: {
    technologies: string[];
    currentFocus: string;
  };
  fitness: {
    focus: string[];
  };
  hiking: {
    lastMountain: string;
    elevation: string;
    date: string;
    location: string;
  };
  experiments: {
    // 👈 agregado
    focus: string;
    current: string[];
    recent: string;
  };
}

const nowData: NowData = {
  reading: {
    title: 'EL arte de la buena vida',
    author: 'William B. Irvine',
    progress: 67,
    cover: 'https://imagessl6.casadellibro.com/a/l/s7/76/9788449335976.webp',
  },
  language: {
    name: 'Portugués',
    level: 'A2',
    platform: 'Duolingo, Anki, canales de Youtube y charlas TEDx',
  },
  music: {
    song: 'into the fire',
    artist: 'Dokken',
    youtubeUrl: 'https://www.youtube.com/watch?v=XQ9XcMybcX8',
  },
  project: {
    name: '4 guitarras electricas',
    description:
      'Empecé hace un tiempo 4 guitarras eléctricas hechas todas desde cero, quitando las partes metálicas y las pastillas, todo está prácticamente hecho a mano y de madera. Dos están terminadas, estoy a falta de colocar el hardware en las otras dos.',
    skills: ['Paciencia', 'Electrónica', 'Carpintería', 'Acabados', 'Epoxi'],
    progress: 94,
  },
  learning: {
    technologies: ['Flask', 'AI tools'],
    currentFocus: 'Todavía en la web',
  },
  fitness: {
    focus: ['10 Muscle-up estrictos'],
  },
  hiking: {
    lastMountain: 'Udalaitz',
    elevation: '1.120 m',
    date: '30 Ago 2025',
    location: 'País Vasco',
  },
  experiments: {
    // 👈 agregado
    focus: 'Mejornando habilidades de carpintero. Afilando cepillos y mejorando el uso de estos.',
    current: [],
    recent: '',
  },
};

interface NowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NowModal({ isOpen, onClose }: NowModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="now-modal-overlay">
      {/* Backdrop */}
      <div className="now-modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="now-modal">
        {/* Header */}
        <div className="now-modal-header">
          <div>
            <h2 className="now-modal-title">¿Qué estoy haciendo ahora?</h2>
            <p className="now-modal-subtitle">Un vistazo a mis actividades actuales</p>
          </div>
          <button className="now-modal-close-btn" onClick={onClose}>
            <IoClose size={20} />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>

        {/* Content */}
        <div className="now-modal-content">
          <div className="now-modal-grid">
            {/* Reading */}
            <div className="now-modal-card">
              <div className="now-modal-card-header">
                <IoBook className="now-modal-icon" />
                <h3 className="now-modal-card-title">Leyendo</h3>
              </div>
              <div className="now-modal-reading-content">
                <img
                  src={nowData.reading.cover || '/placeholder.svg'}
                  alt={nowData.reading.title}
                  className="now-modal-book-cover"
                />
                <div className="now-modal-reading-info">
                  <p className="now-modal-book-title">{nowData.reading.title}</p>
                  <p className="now-modal-book-author">{nowData.reading.author}</p>
                </div>
              </div>
            </div>

            {/* Language */}
            <div className="now-modal-card">
              <div className="now-modal-card-header">
                <IoGlobe className="now-modal-icon" />
                <h3 className="now-modal-card-title">Idioma</h3>
              </div>
              <div className="now-modal-language-content">
                <div>
                  <p className="now-modal-language-name">{nowData.language.name}</p>
                  <p className="now-modal-language-level">Nivel {nowData.language.level} ?</p>
                  <p className="now-modal-language-platform">{nowData.language.platform}</p>
                </div>
              </div>
            </div>

            {/* Music */}
            <div className="now-modal-card">
              <div className="now-modal-card-header">
                <IoMusicalNotes className="now-modal-icon" />
                <h3 className="now-modal-card-title">Escuchando</h3>
              </div>
              <div>
                <p className="now-modal-song-title">{nowData.music.song}</p>
                <p className="now-modal-song-artist">{nowData.music.artist}</p>
                <a
                  href={nowData.music.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="now-modal-music-link"
                >
                  <IoPlay size={12} />
                  Ver en YouTube
                  <FiExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* Project */}
            <div className="now-modal-card now-modal-project-card">
              <div className="now-modal-card-header">
                <IoCode className="now-modal-icon" />
                <h3 className="now-modal-card-title">Proyecto Actual</h3>
              </div>
              <div>
                <p className="now-modal-project-name">{nowData.project.name}</p>
                <p className="now-modal-project-description">{nowData.project.description}</p>
                <div className="now-modal-tech-tags">
                  {nowData.project.skills.map((skill, index) => (
                    <span key={index} className="now-modal-tech-tag">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="now-modal-progress-container">
                  <div className="now-modal-progress-track">
                    <div
                      className="now-modal-progress-bar"
                      style={{ width: `${nowData.project.progress}%` }}
                    />
                  </div>
                  <p className="now-modal-progress-text">{nowData.project.progress}% completado</p>
                </div>
              </div>
            </div>

            {/* Learning */}
            <div className="now-modal-card">
              <div className="now-modal-card-header">
                <IoCode className="now-modal-icon" />
                <h3 className="now-modal-card-title">Aprendiendo</h3>
              </div>
              <div>
                <p className="now-modal-learning-focus">{nowData.learning.currentFocus}</p>
                <div className="now-modal-learning-tags">
                  {nowData.learning.technologies.map((tech, index) => (
                    <span key={index} className="now-modal-learning-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Fitness */}
            <div className="now-modal-card now-modal-card-fitness">
              <div className="now-modal-card-header">
                <IoFitness className="now-modal-icon" />
                <h3 className="now-modal-card-title">Calistenia</h3>
              </div>
              <div>
                <div className="now-modal-fitness-focus">
                  <p className="now-modal-fitness-focus-label">Enfoque actual:</p>
                  <div className="now-modal-fitness-tags">
                    {nowData.fitness.focus.map((exercise, index) => (
                      <span key={index} className="now-modal-fitness-tag">
                        {exercise}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Hiking */}
            <div className="now-modal-card now-modal-card-hikking">
              <div className="now-modal-card-header">
                <FaMountain className="now-modal-icon" />
                <h3 className="now-modal-card-title">Último Monte</h3>
              </div>
              <div>
                <p className="now-modal-mountain-name">{nowData.hiking.lastMountain}</p>
                <p className="now-modal-mountain-location">{nowData.hiking.location}</p>
                <div className="now-modal-mountain-details">
                  <span>{nowData.hiking.elevation}</span>
                  <span>{nowData.hiking.date}</span>
                </div>
              </div>
            </div>
            {/* Experiments */}
            <div className="now-modal-card">
              <div className="now-modal-card-header">
                <IoFlask className="now-modal-icon" />
                <h3 className="now-modal-card-title">Experimentos</h3>
              </div>
              <div>
                <p className="now-modal-experiments-focus">{nowData.experiments.focus}</p>
                <div className="now-modal-experiments-section">
                  <p className="now-modal-experiments-label">Actual:</p>
                  <div className="now-modal-experiments-tags">
                    {nowData.experiments.current.map((experiment, index) => (
                      <span key={index} className="now-modal-experiment-tag">
                        {experiment}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="now-modal-experiments-recent">
                  <p className="now-modal-experiments-recent-label">Reciente:</p>
                  <p className="now-modal-experiments-recent-text">{nowData.experiments.recent}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="now-modal-footer">
            <p className="now-modal-footer-text">
              Esta información se actualiza un poco aleatoriamente, así que tampoco te fíes...
            </p>
            <p className="now-modal-footer-date">La última vez fue: 19 de abril de 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
