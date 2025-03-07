import HomeHero from './components/HomeHero';
import Post from './components/Post';
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
    <div className="archive">      
       <HomeHero />
        <div className="posts container">
          <div className="last-posts">
            <h2 className='mb-1'>Mis últimos posts</h2>
            <div className="grid">
              {posts.map((post) => (
                <Post id={post.id} title={post.title} content={post.content} createdAt={post.createdAt} />                
              ))}
            </div>
          </div>
      </div>
    </div>  
  );
};

export default Home;
