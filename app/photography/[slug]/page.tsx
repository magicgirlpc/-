import { notFound } from "next/navigation";
import { CaseStudyPage } from "../../CaseStudyPage";
import { movingImageProjects } from "../../portfolio-data";

export function generateStaticParams() { return movingImageProjects.map((project) => ({ slug: project.slug })); }
export default async function PhotographyCase({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const project = movingImageProjects.find((item) => item.slug === slug); if (!project) notFound(); return <CaseStudyPage type="影像" project={project} backHref="/photography" />; }
