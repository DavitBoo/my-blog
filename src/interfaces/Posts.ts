import {ILabel} from './Label'

export interface IPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  labels: ILabel[];
  views: number;
  coverUrl: string
}