import { fetchPosts } from './utils/api';

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const Home = async () => {
  // Fetch posts directly
  const posts: Post[] = await fetchPosts();

  return (
    <div className="container">
      <h1>My Blog</h1>
      <div className="posts">
        {posts.map((post) => (
          <a key={post.id} href={`/post/${post.id}`} className="postCard">
            <h2>{post.title}</h2>
            <p>{post.content.substring(0, 100)}...</p>
            <small>{new Date(post.createdAt).toLocaleDateString()}</small>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Home;
