"use client";

import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import { fetchPosts } from "../utils/api";
import SearchInput from "../components/SearchInput";
import Loader from "../components/Loader";
import {IPost} from '../../interfaces/Posts'


const POSTS_PER_PAGE = 3;

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts: IPost[] = await fetchPosts();
      setPosts(fetchedPosts);
      const uniqueLabels = Array.from(new Set(fetchedPosts.flatMap((post) => post.labels.map((label) => label.name))));
      setLabels(uniqueLabels);
      setIsLoading(false);
    };
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesLabel = selectedLabel ? post.labels.some((label) => label.name === selectedLabel) : true;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLabel && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  if (isLoading) {
    return <Loader message="Cargando artículos..." />;
  }

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

        <div className="last-posts mb-8">
          <h2 className="mb-4">Todos mis artículos</h2>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
          <div className="grid">
            {paginatedPosts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                slug={post.slug}
                createdAt={post.createdAt}
                labels={post.labels}
                views={post.views}
                coverUrl={post.coverUrl}
              />
            ))}
          </div>
        </div>

        {/* Paginación con botones numerados */}
        {totalPages > 1 && (
          <div className="pagination d-flex">
            <button
              className="btn btn-tab prev"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
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
            <button
              className="btn btn-tab next"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <span>Siguiente</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
