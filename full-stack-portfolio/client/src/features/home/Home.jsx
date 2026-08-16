import React from "react";
import { Hero, Universe } from "./components";
import { SEO, Testimonials } from "@/components";
import { siteConfig } from "@/config/siteConfig";

const Home = () => {
  const homeConfig = siteConfig?.pages?.home;

  return (
    <>
      <SEO description={homeConfig?.seo?.description} />

      <Hero heroConfig={homeConfig?.hero} />

      <section className="px-4 md:px-8 max-w-7xl mx-auto my-15 space-y-20">
        <Universe />
        <Testimonials />
      </section>
    </>
  );
};

export default Home;
