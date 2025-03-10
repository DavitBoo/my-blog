"use client";

import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import { fetchPosts } from "../utils/api";

interface Label {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  labels: Label[];
}

const POSTS_PER_PAGE = 3;

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts: Post[] = await fetchPosts();
      setPosts(fetchedPosts);
      const uniqueLabels = Array.from(new Set(fetchedPosts.flatMap((post) => post.labels.map((label) => label.name))));
      setLabels(uniqueLabels);
    };
    loadPosts();
  }, []);

  const filteredPosts = selectedLabel
    ? posts.filter((post) => post.labels.some((label) => label.name === selectedLabel))
    : posts;

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="archive">
      <div className="container">
        <div className="nav-tabs">
          <button
            className={`btn btn-tab ${selectedLabel === null ? "active" : ""}`}
            onClick={() => setSelectedLabel(null)}
          >
            <span>Todos</span>
          </button>
          {labels.map((label) => (
            <button
              key={label}
              className={`btn btn-tab ${selectedLabel === label ? "active" : ""}`}
              onClick={() => setSelectedLabel(label)}
            >
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="last-posts mb-2">
          <h2 className="mb-1">Mis últimos posts</h2>
          <div className="grid">
            {paginatedPosts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                createdAt={post.createdAt}
                labels={post.labels}
              />
            ))}
          </div>
        </div>

        {/* Paginación con botones numerados */}
        {totalPages > 1 && (
          <div className="pagination d-flex">
            <button className="btn btn-tab prev" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              <span>Anterior</span>
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`btn btn-tab ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                <span>{index + 1}</span>
              </button>
            ))}
            <button className="btn btn-tab next" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              <span>Siguiente</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
