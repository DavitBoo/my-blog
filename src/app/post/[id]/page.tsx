import { fetchPostById } from '../../utils/api';
import CommentSection from '../../components/CommentSection';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

  return (
    <main className='article-page'>
      <div className="container">
      <header className="article-header" aria-label="Article Header">
          <div className="timestamp">
            <time>{format(new Date(post.createdAt), 'EEEE, dd MMMM yyyy', { locale: es })}</time>
          </div>
          <span className="author">by {post?.author?.name}</span>
        </header>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <small>Published on {new Date(post.createdAt).toLocaleDateString()}</small>
        <CommentSection postId={post.id} />
      </div>
    </main>
  );  
};

export default PostPage;
