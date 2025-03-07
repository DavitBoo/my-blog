import React from "react";

interface PostProps {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const Post = ({id, title, content, createdAt}: PostProps) => {
  return (
    <a key={id} href={`/post/${id}`} className="postCard">
      <h3>{title}</h3>
      <p>{content.replace(/<[^>]*>/g, "").substring(0, 200)}...</p>
      <small>{new Date(createdAt).toLocaleDateString()}</small>
    </a>
  );
};

export default Post;
