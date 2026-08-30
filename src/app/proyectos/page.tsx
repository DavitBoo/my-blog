'use client';

import React, { useState, useEffect } from 'react';
import Project, { IProject } from '../components/Project';
import { fetchProjects } from '../utils/api';
import SearchInput from '../components/SearchInput';
import Loader from '../components/Loader';

const PROJECTS_PER_PAGE = 9;

const Proyectos: React.FC = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      const fetchedProjects: IProject[] = (await fetchProjects()) || [];
      setProjects(fetchedProjects);
      const uniqueCats = Array.from(
        new Set(fetchedProjects.map((p) => p.category?.name).filter(Boolean)),
      ) as string[];
      setCategories(uniqueCats);
      setIsLoading(false);
    };
    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory ? project.category?.name === selectedCategory : true;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE,
  );

  if (isLoading) {
    return <Loader message="Cargando proyectos..." />;
  }

  return (
    <div className="archive">
      <div className="container">
        <div className="nav-tabs">
          <button
            className={`btn btn-tab ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            <span>Todos</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>

        <div className="last-posts mb-8">
          <h2 className="mb-4">Mis Proyectos</h2>
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
          <div className="grid">
            {paginatedProjects.map((project) => (
              <Project
                key={project.id}
                id={project.id}
                title={project.title}
                content={project.content}
                slug={project.slug}
                createdAt={project.createdAt}
                category={project.category}
                views={project.views}
                coverUrl={project.coverUrl}
              />
            ))}
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

export default Proyectos;
