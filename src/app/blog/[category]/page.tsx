"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Post from "../../components/Post";
import { fetchPosts } from "../../utils/api";
import { slugify } from "@/app/utils/slugify";

import {IPost} from '../../../interfaces/Posts'


const POSTS_PER_PAGE = 3;

const BlogCategory: React.FC = () => {
  const { category } = useParams();
  const decodedCategory = category ? decodeURIComponent(category.toString()) : "";

  const [posts, setPosts] = useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPosts = async () => {
      const fetchedPosts: IPost[] = await fetchPosts();

      const filteredPosts = fetchedPosts.filter((post) =>
        post.labels.some((label) => slugify(label.name) === slugify(decodedCategory))
      );

      setPosts(filteredPosts);
    };

    loadPosts();
  }, [category]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="archive">
      <div className="container">
        <h2>Posts en la categoría: {decodedCategory.replace("-", " ")}</h2>

        <div className="last-posts mb-8">
          <h2 className="mb-4">Mis últimos posts</h2>
          <div className="grid">
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
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
              ))
            ) : (
              <p>No hay posts en esta categoría.</p>
            )}
          </div>
        </div>

        {/* Paginación */}
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

export default BlogCategory;
