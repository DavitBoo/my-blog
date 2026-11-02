import { Metadata } from 'next';
import BlogExplorer from './BlogExplorer';
import { fetchPosts } from '../utils/api';
import { IPostSummary } from '../../interfaces/Posts';

export const metadata: Metadata = {
  title: 'Todos los artículos',
  description: 'Todo lo que he escrito sobre programación, lutheria, idiomas, viajes y más.',
};

// ISR: si la API no estaba disponible durante el build, la página se regenera sola
export const revalidate = 60;

const BlogPage = async () => {
  const posts: IPostSummary[] = (await fetchPosts()) ?? [];
  return <BlogExplorer posts={posts} />;
};

export default BlogPage;
