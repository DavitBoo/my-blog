import Link from 'next/link';
import styles from './customCard.module.css';

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const customCard = ({ post }: { post: Post }) => {
  return (
    <div className={styles.card}>
      <Link href={`/post/${post.id}`} className={styles.link}>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.excerpt}>{post.content.substring(0, 100)}...</p>
        <small className={styles.date}>
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </small>
      </Link>
    </div>
  );
};

export default customCard;
