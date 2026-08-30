'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../utils/api';

// components
import { ThreeBackground } from './ThreeBackground';

const HomeHero = () => {
  const [randomPostSlug, setRandomPostSlug] = useState<string | null>(null);

  useEffect(() => {
    const loadRandomPost = async () => {
      const fetchedPosts = await fetchPosts();
      if (fetchedPosts && fetchedPosts.length > 0) {
        const randomIndex = Math.floor(Math.random() * fetchedPosts.length);
        const randomPost = fetchedPosts[randomIndex];
        setRandomPostSlug(randomPost.slug); // 👈 Usamos el slug
      }
    };
    loadRandomPost();
  }, []);

  return (
    <div className="home-hero" style={{ position: 'relative', minHeight: '100vh' }}>
      <ThreeBackground />
      <div className="container">
        <div className="mw-48" style={{ zIndex: '999' }}>
          <h1>Mi blog</h1>
          <h2 className="mb-8">
            Aprendo cosas, experimento y te las cuento: Programación, deportes, salud, lutheria,
            guitarras, idiomas, viajes, fotografía, ...
          </h2>
          <p>
            Te contaré más sobre mi, pero básicamente, una de las mejores forma de aprender es
            enseñar. Pienso que hasta que no explicas algo a alguien no lo entiendes del todo.
            Además se trata de que esto sea como una especie de diario online, y bueno si ya de paso
            le sirve a la gente para consultar algún tema o aprender algo, ¡pues oye!
          </p>
          <p>
            Sería la hostia por otro lado tener un feedback de gente, preguntas y tal, pero vaya,
            que momento con escribir yo de vez en cuando estoy contento.
          </p>
          <div className="d-flex gap-4">
            <Link href="/blog" className="btn btn-primary">
              <span>Venga, leamos</span>
            </Link>

            <Link
              href={randomPostSlug ? `/post/${randomPostSlug}` : '#'}
              className={`btn btn-primary ${!randomPostSlug ? 'disabled' : ''}`}
            >
              <span>Artículo random</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
