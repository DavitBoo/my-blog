'use client';

import { useState, useEffect } from 'react';
import { fetchCommentsByPostId, createComment } from '../utils/api';

type Comment = {
  id: number;
  content: string;
  createdAt: string;
};

const CommentSection = ({ postId }: { postId: number }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const loadComments = async () => {
      const comments = await fetchCommentsByPostId(postId);
      setComments(comments);
    };
    loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('');
    try {
      await createComment(postId, newComment, email);
      setNewComment('');
      setEmail('');
      setFeedback('¡Gracias! Tu comentario aparecerá cuando lo revise.');
    } catch (error) {
      console.error('Error creating comment:', error);
      setFeedback(error instanceof Error ? error.message : 'No se pudo enviar el comentario.');
    }
  };

  return (
    <section className="commentsWrapper">
      <div className="commentCreatorWrapper">
        <h3>Deja un comentario</h3>
        <form action="" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Tu email (no se publicará)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Añade un comentario"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            id="comment"
            maxLength={2000}
            required
          />
          <input className="btn" type="submit" value="Enviar" />
          {feedback && <p role="status">{feedback}</p>}
        </form>
      </div>
      <div className="commentContainer">
        <h3>Comentarios ({comments.length})</h3>
        <div className="comments">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="commentInfo">
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
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
