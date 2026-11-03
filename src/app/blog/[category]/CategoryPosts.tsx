'use client';

import React, { useState } from 'react';
import Pagination from '../../components/Pagination';
import Post from '../../components/Post';
import { IPostSummary } from '../../../interfaces/Posts';

const POSTS_PER_PAGE = 3;

const CategoryPosts = ({ posts }: { posts: IPostSummary[] }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  return (
    <>
      <div className="last-posts mb-8">
        <h2 className="mb-4">Mis últimos posts</h2>
        <div className="grid">
          {paginatedPosts.length > 0 ? (
            paginatedPosts.map((post) => (
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
            ))
          ) : (
            <p>No hay posts en esta categoría.</p>
          )}
        </div>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
    </>
  );
};

export default CategoryPosts;
