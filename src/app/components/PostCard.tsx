import Link from 'next/link';
import styles from './customCard.module.css';
import {IPost} from '../../interfaces/Posts'


const customCard = ({ post }: { post: IPost }) => {
  return (
    <div className={styles.card}>
      <Link href={`/post/${post.slug}`} className={styles.link}>
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
