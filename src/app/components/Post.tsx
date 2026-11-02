import React from 'react';
import Image from 'next/image';

import { FaCalendar, FaEye, FaGlasses } from 'react-icons/fa';

import { IPostSummary } from '../../interfaces/Posts';

const formatRelativeDate = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'hoy';
  } else if (diffDays < 7) {
    return `hace ${diffDays} día${diffDays === 1 ? '' : 's'}`;
  } else if (diffDays < 28) {
    const weeks = Math.floor(diffDays / 7);
    return `hace ${weeks} semana${weeks === 1 ? '' : 's'}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `hace ${months} mes${months === 1 ? '' : 'es'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `hace ${years} año${years === 1 ? '' : 's'}`;
  }
};

const Post = ({
  id,
  title,
  // Valores por defecto: una respuesta aún en caché o un backend sin actualizar no traen estos campos
  excerpt = '',
  readingTime = 1,
  slug,
  createdAt,
  labels,
  views,
  coverUrl,
}: IPostSummary) => {
  return (
    <div key={id} className="customCard">
      <div>
        <Image
          src={coverUrl ? coverUrl : '/placeholder.jpg'}
          alt=""
          width={300}
          height={200}
          className="postImage"
        />
      </div>
      <div className="labels">
        {labels.map((label) => (
          <span key={label.id} className="label">
            {label.name}
          </span>
        ))}
      </div>
      <div className="card-body">
        <h3 className="mb-4">
          <a href={`/post/${slug}`}>{title}</a>
        </h3>
        <p>{excerpt.substring(0, 150)}...</p>
        {/* En /blog se hidrata desde una página cacheada: la fecha relativa puede diferir unos segundos */}
        <small suppressHydrationWarning>
          <FaCalendar /> {formatRelativeDate(createdAt)}
        </small>
        <small>
          <FaGlasses /> {readingTime} min
        </small>
        <small>
          <div className="views-count d-flex align-items-center gap-1">
            <FaEye /> {views} visitas
          </div>
        </small>
      </div>
    </div>
  );
};

export default Post;
