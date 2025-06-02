'use client'
import React from 'react';

const custom404 = () => {
  return (
    <div className="error-404 not-found-container">
      
      <h1 className="error-code">404</h1>
      <p className="error-message">¡Vaya! Parece que te has perdido.</p>
      <input
        type="text"
        className="search-bar"
        placeholder="Buscar en el blog..."
      />
      <div className="button-group">
        <button className="btn" onClick={() => window.location.href = '/'}>
          <span>Volver al inicio</span>
        </button>
        <button className="btn" onClick={() => window.location.href = '/contacto'}>
          <span>Visitar artículo random</span>
        </button>
      </div>
    </div>
  );
};

export default custom404;
