import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetail from "../../pacome/ProjectDetail";
import { getNextPacomeProject, getPacomeProject, pacomeProjects } from "../../pacome/data";
import "../project-detail.css";

export function generateStaticParams() {
  return pacomeProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getPacomeProject(slug);
  return project
    ? { title: `${project.title} — Pengcheng`, description: project.description }
    : { title: "Project not found" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getPacomeProject(slug);
  const nextProject = getNextPacomeProject(slug);

  if (!project || !nextProject) notFound();
  return <ProjectDetail project={project} nextProject={nextProject} />;
}
