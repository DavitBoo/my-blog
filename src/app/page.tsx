import HomeHero from "./components/HomeHero";
import Post from "./components/Post";
import { fetchPosts } from "./utils/api";

import { IPost } from "../interfaces/Posts";

// ! updating urls from id => slug + IPost interface

const Home = async () => {
  // Fetch posts directly
  const posts: IPost[] = await fetchPosts();
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
