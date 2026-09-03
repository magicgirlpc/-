import type { Metadata } from "next";
import PortfolioExperience from "./pacome/PortfolioExperience";
import "./pacome.css";

export const metadata: Metadata = {
  title: "Pengcheng's Portfolio",
  description: "Motion and sound designer based in Paris.",
  icons: {
    icon: "/sites/pacomepertant-com-b16b412f/root-8a5edab2/favicon.svg",
  },
};

export default function Home() {
  return <PortfolioExperience />;
}
