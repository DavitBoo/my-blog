import { fetchPostById, fetchLabels } from "../../utils/api";
import CommentSection from "../../components/CommentSection";
import BackButton from "../../components/BackButton";

import { format } from "date-fns";
import { decode } from "html-entities";
import { es } from "date-fns/locale";

import { ILabel } from "../../../interfaces/Label";

import { FaGlasses } from "react-icons/fa";

import Image from "next/image";

type PostProps = {
  params: { id: string };
};

const PostPage = async ({ params }: PostProps) => {
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
    const time = Math.ceil(words / wpm);
    return time;
  };

  const labels = await fetchLabels();

  return (
    <main className="article-page">
      <div className="container">
        <ul className="label-list">
          {post?.labels?.map((label: ILabel) => (
            <li key={label.id.toString()} className="label-list-item">
              {label.name}
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
            {/* <span className="author">by {post?.author?.name}</span> */}
          </header>
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
          {label.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default PostPage;
