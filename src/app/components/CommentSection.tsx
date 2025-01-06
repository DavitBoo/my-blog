"use client"

import { useState, useEffect } from 'react';
import { fetchCommentsByPostId, createComment } from '../utils/api';

type Comment = {
  id: number;
  content: string;
  email: string;
  createdAt: string;
};

const CommentSection = ({ postId }: { postId: number }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadComments = async () => {
      const comments = await fetchCommentsByPostId(postId);
      setComments(comments);
    };
    loadComments();
  }, [postId]);

  const handleSubmit = async () => {
    try {
      await createComment(postId, newComment, email);
      setNewComment('');
      setEmail('');
      const updatedComments = await fetchCommentsByPostId(postId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <small>
            {comment.email} - {new Date(comment.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
      <textarea
        placeholder="Add a comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CommentSection;
