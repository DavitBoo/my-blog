import HomeHero from "./components/HomeHero";
import Post from "./components/Post";
import { fetchPosts } from "./utils/api";

import { IPost } from "../interfaces/Posts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog de David Boo | Inicio",
  description: "Bienvenido a mi sitio web sobre muchas cosas.",
  keywords: ["desarrollo web", "programación", "lectura", "idiomas", "lutheria"],
  authors: [{ name: "David", url: "https://my-blog-omega-pearl.vercel.app/" }],
  openGraph: {
    title: "Web de un polímata",
    description: "Mis últimos artículos sobre ....",
    url: "https://my-blog-omega-pearl.vercel.app/",
    siteName: "Diogenes Brain",
    images: [
      {
        url: "https://tusitio.com/og-image.jpg", // reemplaza con tu imagen real
        width: 1200,
        height: 630,
        alt: "Imagen de portada del blog",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
};

const Home = async () => {
  // Fetch posts directly
  const posts: IPost[] = await fetchPosts();
  console.log(posts[0]);
  return (
    <div className="archive">
      <HomeHero />
      <div className="posts container">
        <div className="last-posts">
          <h2 className="mb-4">Mis últimos posts</h2>
          <div className="grid">
            {posts.map((post) => (
              <Post
                id={post.id}
                title={post.title}
                content={post.content}
                slug={post.slug}
                createdAt={post.createdAt}
                labels={post.labels}
                views={post.views}
                coverUrl={post.coverUrl}
              />
            ))}
          </div>
        </div>
        <a href="" className="btn btn-primary"><span>Ver todos los artículos</span></a>
      </div>
    </div>
  );
};

export default Home;
