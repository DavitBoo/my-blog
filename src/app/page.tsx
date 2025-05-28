import HomeHero from "./components/HomeHero";
import Post from "./components/Post";
import { fetchPosts } from "./utils/api";

interface Label {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  labels: Label[];
  views: number;
  coverUrl: string;
}

const Home = async () => {
  // Fetch posts directly
  const posts: Post[] = await fetchPosts();
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
