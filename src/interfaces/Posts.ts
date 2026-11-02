import { ILabel } from './Label';

export interface IPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
  labels: ILabel[];
  views: number;
  coverUrl: string;
  metaTitle?: string;
  metaDescription?: string;
}

// Lo que devuelven los listados: el contenido completo solo llega al abrir un artículo
export interface IPostSummary extends Omit<IPost, 'content'> {
  excerpt: string;
  readingTime: number;
}
