import React from "react";
import Image from "next/image";

import { FaCalendar } from 'react-icons/fa';

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
}

const Post = ({ id, title, content, createdAt, labels }: PostProps) => {
  return (
    <div key={id} className="postCard">
      <Image src="/placeholder.jpg" alt="Placeholder" width={200} height={150} className="postImage" />
      <div className="labels">
        {labels.map((label) => (
          <span key={label.id} className="label">
            {label.name}
          </span>
        ))}
      </div>
      <div className="card-body">
        <h3 className="mb-1">
          <a href={`/post/${id}`}>{title}</a>
        </h3>
        <p>{content.replace(/<[^>]*>/g, "").substring(0, 150)}...</p>
        <small><FaCalendar/> {new Date(createdAt).toLocaleDateString()}</small>
      </div>
    </div>
  );
};

export default Post;
