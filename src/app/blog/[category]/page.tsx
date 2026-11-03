import { Metadata } from 'next';
import CategoryPosts from './CategoryPosts';
import { fetchPosts } from '../../utils/api';
import { slugify } from '../../utils/slugify';
import { IPostSummary } from '../../../interfaces/Posts';

type CategoryProps = {
  params: Promise<{ category: string }>;
};

// Los enlaces a categorías llevan el nombre en forma de slug: se recupera el original de las
// etiquetas para mostrarlo con sus mayúsculas y acentos
const loadCategory = async (params: CategoryProps['params']) => {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const categorySlug = slugify(decodedCategory);

  const allPosts: IPostSummary[] = (await fetchPosts()) ?? [];
  const posts = allPosts.filter((post) =>
    post.labels.some((label) => slugify(label.name) === categorySlug),
  );
  const labelName = posts[0]?.labels.find((label) => slugify(label.name) === categorySlug)?.name;

  return { posts, name: labelName ?? decodedCategory.replace(/-/g, ' ') };
};

export async function generateMetadata({ params }: CategoryProps): Promise<Metadata> {
  const { name } = await loadCategory(params);
  return {
    title: `Posts sobre ${name}`,
    description: `Todo lo que he escrito sobre ${name}.`,
  };
}

// ISR: la página de cada categoría se genera al visitarla y se regenera sola
export const revalidate = 60;

const BlogCategory = async ({ params }: CategoryProps) => {
  const { posts, name } = await loadCategory(params);

  return (
    <div className="archive">
      <div className="container">
        <h1 className="page-heading">Posts en la categoría: {name}</h1>
        <CategoryPosts posts={posts} />
      </div>
    </div>
  );
};

export default BlogCategory;
