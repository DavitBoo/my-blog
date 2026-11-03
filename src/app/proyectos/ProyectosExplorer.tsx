'use client';

import React, { useMemo, useState } from 'react';
import Pagination from '../components/Pagination';
import Project, { IProject } from '../components/Project';
import SearchInput from '../components/SearchInput';

const PROJECTS_PER_PAGE = 9;

const ProyectosExplorer = ({ projects }: { projects: IProject[] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category?.name).filter(Boolean))) as string[],
    [projects],
  );

  const selectCategory = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const changeSearchTerm = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

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

  return (
    <div className="archive">
      <div className="container">
        <div className="nav-tabs">
          <button
            className={`btn btn-tab ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => selectCategory(null)}
          >
            <span>Todos</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-tab ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => selectCategory(cat)}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>

        <div className="last-posts mb-8">
          <h1 className="page-heading mb-4">Mis Proyectos</h1>
          <SearchInput value={searchTerm} onChange={changeSearchTerm} />
          <div className="grid">
            {paginatedProjects.map((project) => (
              <Project
                key={project.id}
                id={project.id}
                title={project.title}
                excerpt={project.excerpt}
                slug={project.slug}
                createdAt={project.createdAt}
                category={project.category}
                views={project.views}
                coverUrl={project.coverUrl}
              />
            ))}
          </div>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default ProyectosExplorer;
