import { fetchPostById } from '../../utils/api';
import CommentSection from '../../components/CommentSection';

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
    <div className='container'>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <small>Published on {new Date(post.createdAt).toLocaleDateString()}</small>
      <CommentSection postId={post.id} />
    </div>
  );
};

export default PostPage;
