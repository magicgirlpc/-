import { notFound } from "next/navigation";
import { CaseStudyPage } from "../../CaseStudyPage";
import { graphicProjects } from "../../portfolio-data";

export function generateStaticParams() { return graphicProjects.map((project) => ({ slug: project.slug })); }
export default async function GraphicCase({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const project = graphicProjects.find((item) => item.slug === slug); if (!project) notFound(); return <CaseStudyPage type="平面" project={project} backHref="/graphic" />; }
