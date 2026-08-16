import React from "react";
import PageHeader from "@/components/layout/PageHeader";
import BentoGrid from "./BentoGrid";
import AboutPreview from "./previews/AboutPreview";
import TechStackPreview from "./previews/TechStackPreview";
import ExperiencePreview from "./previews/ExperiencePreview";
import ServicesPreview from "./previews/ServicesPreview";
import ProjectsPreview from "./previews/ProjectsPreview";
import PlansPreview from "./previews/PlansPreview";
import ContactPreview from "./previews/ContactPreview";
import bentoItemsConfig from "@/features/home/bento.config.js";
import { siteConfig } from "@/config/siteConfig";

const componentMap = {
  AboutPreview,
  TechStackPreview,
  ExperiencePreview,
  ServicesPreview,
  ProjectsPreview,
  PlansPreview,
  ContactPreview,
};

const Universe = () => {
  const universeConfig = siteConfig?.pages?.home?.universe?.header;
  return (
    <section>
      <PageHeader
        title={universeConfig?.title}
        description={universeConfig?.description}
        headingLevel="h2"
      />

      <BentoGrid>
        {React.useMemo(
          () => [...bentoItemsConfig].sort((a, b) => a.priority - b.priority),
          [],
        ).map((item) => {
          const Component = componentMap[item.component];
          if (!Component) return null;
          return <Component key={item.id} className={item.className} />;
        })}
      </BentoGrid>
    </section>
  );
};

export default Universe;
