import { Metadata } from 'next';
import ProyectosExplorer from './ProyectosExplorer';
import { fetchProjects } from '../utils/api';
import { IProject } from '../components/Project';

export const metadata: Metadata = {
  title: 'Mis proyectos',
  description: 'Proyectos en los que he trabajado y cosas que he construido.',
};

// ISR: si la API no estaba disponible durante el build, la página se regenera sola
export const revalidate = 60;

const ProyectosPage = async () => {
  const projects: IProject[] = (await fetchProjects()) ?? [];
  return <ProyectosExplorer projects={projects} />;
};

export default ProyectosPage;
