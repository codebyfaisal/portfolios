import React from "react";
import { FaCode } from "react-icons/fa";
import DOMPurify from "dompurify";

const RenderIcon = ({ icon, className = "", defaultIcon }) => {
  if (icon) {
    if (icon.startsWith("http") || icon.startsWith("data:image")) {
      return (
        <img
          src={icon}
          className={`w-12 h-12 object-contain rounded-full border-none outline-none ${className}`}
          alt="Service Icon"
        />
      );
    }
    const trimmed = icon.trim();
    if (trimmed.startsWith("<svg") || trimmed.startsWith("<?xml")) {
      const cleanSvg = DOMPurify.sanitize(trimmed, { USE_PROFILES: { html: true, svg: true, svgFilters: true } });
      return (
        <div
          className={`h-full grow flex justify-center items-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-[2rem] [&>svg]:max-h-[2rem] [&>svg]:fill-current ${className}`}
          dangerouslySetInnerHTML={{ __html: cleanSvg }}
        />
      );
    }
    return (
      <FaCode
        className={`h-9 w-9 grow flex justify-center items-center ${className}`}
      />
    );
  }

  if (defaultIcon) {
    const cleanDefault = DOMPurify.sanitize(defaultIcon, { USE_PROFILES: { html: true, svg: true, svgFilters: true } });
    return (
      <div
        className={`h-full grow flex justify-center items-center ${className}`}
        dangerouslySetInnerHTML={{ __html: cleanDefault }}
      />
    );
  }

  return null;
};

export default RenderIcon;
