import { fetchPostById } from "../../utils/api";
import CommentSection from "../../components/CommentSection";

import { format } from "date-fns";
import { decode } from 'html-entities';
import { es } from "date-fns/locale";

import BackButton from "../../components/BackButton";

import { ILabel } from "../../../interfaces/Label";

import { FaGlasses } from 'react-icons/fa';

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

type PostProps = {
  params: { id: string };
};

const PostPage = async ({ params }: PostProps) => {
  const postId = parseInt(params.id);
  const post = await fetchPostById(postId);

  if (!post) {
    return <div>Post not found</div>;
  }

  const decodedString = decode(post?.content);

  const readingTime = () => {
    const wpm = 250;
    const words = decodedString.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    return time;
  };

  console.log(post);

  return (
    <main className="article-page">
      <div className="container">
        <header className="article-header" aria-label="Article Header">
          <div className="timestamp">
            <time>{format(new Date(post.createdAt), "EEEE, dd MMMM yyyy", { locale: es })}</time>
          </div>
          <span className="author">by {post?.author?.name}</span>
        </header>
        <ul className="label-list">
          {post?.labels?.map((label: ILabel) => (
            <li key={label.id.toString()} className="label-list-item">
              {label.name}
            </li>
          ))}
        </ul>
        <h1>{post.title}</h1>
        <div className="reading-time">
          <FaGlasses /> {readingTime()} min
        </div>
        
        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        <BackButton />
        <small>Published on {new Date(post.createdAt).toLocaleDateString()}</small>
        <CommentSection postId={post.id} />
      </div>
    </main>
  );
};

export default PostPage;
