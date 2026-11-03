'use client';

import React, { useMemo, useState } from 'react';
import Pagination from '../components/Pagination';
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
          <h1 className="page-heading mb-4">Todos mis artículos</h1>
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

        <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default BlogExplorer;
