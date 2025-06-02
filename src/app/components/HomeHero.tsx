"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchPosts } from "../utils/api";

const HomeHero = () => {
  const [randomPostId, setRandomPostId] = useState<number | null>(null);

  useEffect(() => {
    const loadRandomPost = async () => {
      const fetchedPosts = await fetchPosts();
      if (fetchedPosts && fetchedPosts.length > 0) {
        const randomIndex = Math.floor(Math.random() * fetchedPosts.length);
        setRandomPostId(fetchedPosts[randomIndex].id);
      }
    };
    loadRandomPost();
  }, []);

  return (
    <div className="home-hero">
      <div className="container">
        <div className="mw-48">
          <h1>Mi blog</h1>
          <h2 className="mb-8">
            Aprendo cosas, experimento y te las cuento: Programación, deportes, salud, lutheria, guitarras, idiomas,
            viajes, fotografía, ...
          </h2>
          <p>
            Te contaré más sobre mi, pero básicamente, una de las mejores forma de aprender es enseñar. Pienso que hasta
            que no explicas algo a alguien no lo entiendes del todo. Además se trata de que esto sea como una especie de
            diario online, y bueno si ya de paso le sirve a la gente para consultar algún tema o aprender algo, ¡pues
            oye!
          </p>
          <p>
            Sería la hostia por otro lado tener un feedback de gente, preguntas y tal, pero vaya, que momento con
            escribir yo de vez en cuando estoy contento.
          </p>
          <div className="d-flex gap-4">
            <Link href="/blog" className="btn btn-primary">
              <span>Venga, leamos</span>
            </Link>

            <Link href={`/post/${randomPostId}`} className="btn btn-primary">
              <span>Artículo random</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
