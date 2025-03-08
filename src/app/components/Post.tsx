import React from "react";
import Image from "next/image";

interface PostProps {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const Post = ({ id, title, content, createdAt }: PostProps) => {
  return (
    <div key={id} className="postCard">
      <Image 
        src="/placeholder.jpg" 
        alt="Placeholder"
        width={200} 
        height={150} 
        className="postImage"
      />
      <div className="card-body">
        <h3><a href={`/post/${id}`}>{title}</a></h3>
        <p>{content.replace(/<[^>]*>/g, "").substring(0, 200)}...</p>
        <small>{new Date(createdAt).toLocaleDateString()}</small>
      </div>  
    </div>
  );
};

export default Post;