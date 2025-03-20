"use client";

import { useState, useEffect } from "react";
import { fetchCommentsByPostId, createComment } from "../utils/api";

type Comment = {
  id: number;
  content: string;
  email: string;
  createdAt: string;
};

const CommentSection = ({ postId }: { postId: number }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      const comments = await fetchCommentsByPostId(postId);
      setComments(comments);
    };
    loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createComment(postId, newComment, email);
      setNewComment("");
      setEmail("");
      const updatedComments = await fetchCommentsByPostId(postId);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <section className="commentsWrapper">
      <div className="commentCreatorWrapper">
        <h3>Deja un comentario</h3>
        <form action="" onSubmit={handleSubmit}>
          <input type="email" placeholder="Tu email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea
            placeholder="Añade un comentario"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            id="comment"
          />
          <input className="btn" type="submit" value="Enviar" />
        </form>
      </div>
      <div className="commentContainer">
        <h3>Comentarios ({comments.length})</h3>
        <div className="comments">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="commentInfo">
                <span>
                  {comment.email} - {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="commentContent">
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
