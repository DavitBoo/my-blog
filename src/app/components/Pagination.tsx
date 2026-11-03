'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination d-flex">
      <button
        className="btn btn-tab prev"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        <span>Anterior</span>
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          className={`btn btn-tab ${currentPage === index + 1 ? 'active' : ''}`}
          onClick={() => onChange(index + 1)}
        >
          <span>{index + 1}</span>
        </button>
      ))}
      <button
        className="btn btn-tab next"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        <span>Siguiente</span>
      </button>
    </div>
  );
};

export default Pagination;
