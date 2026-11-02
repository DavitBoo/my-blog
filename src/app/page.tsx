import HomeHero from './components/HomeHero';
import Post from './components/Post';
import { fetchPosts } from './utils/api';

import { IPostSummary } from '../interfaces/Posts';
import { Metadata } from 'next';
import Link from 'next/link';

const LATEST_POSTS_COUNT = 6;

export const metadata: Metadata = {
  title: 'Blog de David Boo | Inicio',
  description: 'Bienvenido a mi sitio web sobre muchas cosas.',
  keywords: ['desarrollo web', 'programación', 'lectura', 'idiomas', 'lutheria'],
  authors: [{ name: 'David', url: 'https://my-blog-omega-pearl.vercel.app/' }],
  openGraph: {
    title: 'Web de un polímata',
    description: 'Mis últimos artículos sobre ....',
    url: 'https://my-blog-omega-pearl.vercel.app/',
    siteName: 'Diogenes Brain',
    locale: 'es_ES',
    type: 'website',
  },
};

// ISR: si la API no estaba disponible durante el build, la página se regenera sola
export const revalidate = 60;

const Home = async () => {
  // Fetch posts directly
  const posts: IPostSummary[] = (await fetchPosts(LATEST_POSTS_COUNT)) ?? [];
  return (
    <div className="archive">
      <HomeHero />
      <div className="posts container">
        <div className="last-posts">
          <h2 className="mb-4">Mis últimos posts</h2>
          <div className="grid">
            {posts.map((post) => (
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
        <Link href="/blog" className="btn btn-primary">
          <span>Ver todos los artículos</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
