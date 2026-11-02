'use client';

import React, { useMemo, useState } from 'react';
import Post from '../components/Post';
import SearchInput from '../components/SearchInput';
import { IPostSummary } from '../../interfaces/Posts';

const POSTS_PER_PAGE = 9;

const BlogExplorer = ({ posts }: { posts: IPostSummary[] }) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const labels = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.labels.map((label) => label.name)))),
    [posts],
  );

  const selectLabel = (label: string | null) => {
    setSelectedLabel(label);
    setCurrentPage(1);
  };

  const changeSearchTerm = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesLabel = selectedLabel
      ? post.labels.some((label) => label.name === selectedLabel)
      : true;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLabel && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  return (
    <div className="archive">
      <div className="container">
        <div className="nav-tabs">
          <button
            className={`btn btn-tab ${selectedLabel === null ? 'active' : ''}`}
            onClick={() => selectLabel(null)}
          >
            <span>Todos</span>
          </button>
          {labels.map((label) => (
            <button
              key={label}
              className={`btn btn-tab ${selectedLabel === label ? 'active' : ''}`}
              onClick={() => selectLabel(label)}
            >
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="last-posts mb-8">
          <h2 className="mb-4">Todos mis artículos</h2>
          <SearchInput value={searchTerm} onChange={changeSearchTerm} />
          <div className="grid">
            {paginatedPosts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                title={post.title}
                excerpt={post.excerpt}
                readingTime={post.readingTime}
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
                className={`btn btn-tab ${currentPage === index + 1 ? 'active' : ''}`}
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

export default BlogExplorer;
