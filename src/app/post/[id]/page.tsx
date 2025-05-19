import { fetchPostById, fetchLabels, fetchPosts } from "../../utils/api";
import CommentSection from "../../components/CommentSection";
import BackButton from "../../components/BackButton";
import { slugify } from "../../utils/slugify";

import { format } from "date-fns";
import { decode } from "html-entities";
import { es } from "date-fns/locale";

import { ILabel } from "../../../interfaces/Label";

import { FaGlasses, FaEye } from "react-icons/fa";

import Image from "next/image";
import Link from "next/link";

type PostProps = {
  params: Promise<{ id: string }>;
};

const getRandomPosts = (posts: any[], count: number, excludeId: number) => {
  const filteredPosts = posts.filter((post) => post.id !== excludeId);
  const shuffled = filteredPosts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const PostPage = async (props: PostProps) => {
  const params = await props.params;
  const postId = parseInt(params.id);
  const post = await fetchPostById(postId);

  if (!post) {
    return (
      <div className="no-article" aria-live="assertive">
        No se ha encontrado este artículo
      </div>
    );
  }

  const decodedString = decode(post?.content);

  const readingTime = () => {
    const wpm = 250;
    const words = decodedString.trim().split(/\s+/).length;
    return Math.ceil(words / wpm);
  };

  const labels = await fetchLabels();
  const allPosts = await fetchPosts();

  // Obtener la categoría principal del post actual (suponiendo que tiene al menos una)
  const mainCategory = post.labels.length > 0 ? slugify(post.labels[0].name) : null;

  // Filtrar posts de la misma categoría
  interface IPost {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    labels: ILabel[];
    views: number;
  }

  let relatedPosts: IPost[] = allPosts.filter(
    (p: IPost) =>
      p.id !== postId && // No incluir el post actual
      p.labels.some((label: ILabel) => slugify(label.name) === mainCategory) // Coincide con la categoría principal
  );

  // Seleccionar 3 posts aleatorios de la misma categoría
  let selectedRelatedPosts = getRandomPosts(relatedPosts, 3, postId);

  // Si no hay suficientes, completar con otros aleatorios del total
  if (selectedRelatedPosts.length < 3) {
    const needed = 3 - selectedRelatedPosts.length;
    const additionalPosts = getRandomPosts(allPosts, needed, postId);
    selectedRelatedPosts = [...selectedRelatedPosts, ...additionalPosts].slice(0, 3);
  }

  return (
    <main className="article-page">
      <div className="container">
        <ul className="label-list">
          {post?.labels?.map((label: ILabel) => (
            <li key={label.id.toString()} className="label-list-item">
              <Link href={`/blog/${slugify(label.name)}`}>{label.name}</Link>
            </li>
          ))}
        </ul>
        <h1 className="article-title text-center">{post.title}</h1>
        <div className="d-flex align-items-center justify-content-center gap-6">
          <div className="reading-time">
            <FaGlasses /> {readingTime()} min
          </div>
          <header className="article-header" aria-label="Article Header">
            <div className="timestamp">
              <time>{format(new Date(post.createdAt), "EEEE, dd MMMM yyyy", { locale: es })}</time>
            </div>
          </header>
          <div className="views-count d-flex align-items-center gap-2">
            <FaEye /> {post.views} visitas
          </div>
        </div>
        <Image src="/placeholder.jpg" alt="Placeholder" width={200} height={150} className="featured-image" />

        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        <BackButton />
        <small>Published on {new Date(post.createdAt).toLocaleDateString()}</small>
        <CommentSection postId={post.id} />

        <div className="container">
          <h3>Otros temas que trato en el blog:</h3>
          <ul className="label-list">
            {labels?.map((label: ILabel) => (
              <li key={label.id.toString()} className="label-list-item">
                <Link href={`/blog/${slugify(label.name)}`}>{label.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sección de Posts Relacionados */}
        {selectedRelatedPosts.length > 0 && (
          <div className="interesting-posts">
            <h3>También te puede interesar:</h3>
            <div className="d-flex gap-2">
              {selectedRelatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="related-post customCard">
                  {/* Etiquetas dentro de la card */}
                  <ul className="label-list">
                    {relatedPost.labels.map((label: ILabel) => (
                      <li key={label.id.toString()} className="label-list-item">
                        <Link href={`/blog/${slugify(label.name)}`}>{label.name}</Link>
                      </li>
                    ))}
                  </ul>
                  {/* Título del post */}
                  <h4>
                    <Link href={`/post/${relatedPost.id}`}>{relatedPost.title}</Link>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PostPage;
