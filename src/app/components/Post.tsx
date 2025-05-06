import React from "react";
import Image from "next/image";

import { FaCalendar, FaEye } from 'react-icons/fa';

interface Label {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface PostProps {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  labels: Label[];
  views: number;
}

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

const Post = ({ id, title, content, createdAt, labels, views }: PostProps) => {
  return (
    <div key={id} className="customCard">
      <Image src="/placeholder.jpg" alt="Placeholder" width={200} height={150} className="postImage" />
      <div className="labels">
        {labels.map((label) => (
          <span key={label.id} className="label">
            {label.name}
          </span>
        ))}
      </div>
      <div className="card-body">
        <h3 className="mb-4">
          <a href={`/post/${id}`}>{title}</a>
        </h3>
        <p>{content.replace(/<[^>]*>/g, "").substring(0, 150)}...</p>
        <small><FaCalendar/> {formatRelativeDate(createdAt)}</small>
        <small><div className="views-count d-flex align-items-center gap-1">
          <FaEye /> {views} visitas
        </div></small>
      </div>
    </div>
  );
};

export default Post;
