import React, { useEffect } from "react";
import { seoConfig } from "@/config/seoConfig";

const SEO = ({
  title,
  description,
  keywords,
  image,
  author,
  twitterHandle,
  schemaData,
}) => {
  const siteTitle = seoConfig.siteTitle;
  const pageTitle = title
    ? seoConfig.titleTemplate.replace("%s", title)
    : siteTitle;
  const metaDescription = description || seoConfig.description;
  const metaKeywords = keywords || seoConfig.keywords.join(", ");
  const metaAuthor = author || seoConfig.author;
  const metaImage = image || seoConfig.image;
  const metaTwitter = twitterHandle || seoConfig.twitterHandle;

  // Clean Canonical URL (Origin + Pathname, stripping query parameters and hash)
  const canonicalUrl =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "";

  useEffect(() => {
    document.title = pageTitle;

    const updateMeta = (name, content, attribute = "name") => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const updateLink = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Meta Tags
    updateMeta("description", metaDescription);
    updateMeta("keywords", metaKeywords);
    updateMeta("author", metaAuthor);

    // Open Graph
    updateMeta("og:title", pageTitle, "property");
    updateMeta("og:description", metaDescription, "property");
    updateMeta("og:image", metaImage, "property");
    updateMeta("og:url", canonicalUrl, "property");
    updateMeta("og:type", "website", "property");

    // Twitter
    updateMeta("twitter:title", pageTitle);
    updateMeta("twitter:description", metaDescription);
    updateMeta("twitter:image", metaImage);
    updateMeta("twitter:card", "summary_large_image");
    if (metaTwitter) updateMeta("twitter:creator", metaTwitter);

    // Clean Canonical Link
    updateLink("canonical", canonicalUrl);

    // Hreflang
    const updateHreflang = (lang, href) => {
      let element = document.querySelector(
        `link[rel="alternate"][hreflang="${lang}"]`,
      );
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "alternate");
        element.setAttribute("hreflang", lang);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };
    updateHreflang("en", canonicalUrl);

    // Dynamic JSON-LD Schema
    if (schemaData) {
      let script = document.querySelector(
        'script[type="application/ld+json"]#dynamic-schema',
      );
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("id", "dynamic-schema");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schemaData);
    }
  }, [
    pageTitle,
    metaDescription,
    metaKeywords,
    metaAuthor,
    metaImage,
    metaTwitter,
    canonicalUrl,
    schemaData,
  ]);

  return null;
};

export default SEO;
