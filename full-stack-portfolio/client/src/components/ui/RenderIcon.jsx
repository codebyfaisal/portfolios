import React from "react";
import { FaCode } from "react-icons/fa";
import { cn } from "@/utils/cn";
import { sanitizeHtml } from "@/utils/sanitizeHtml";

const RenderIcon = ({ icon, className = "" }) => {
  if (!icon) return null;
  const trimmed = icon.trim();
  if (trimmed.startsWith("http") || trimmed.startsWith("data:image"))
    return (
      <img
        src={trimmed}
        className={cn(
          "w-12 h-12 object-contain rounded-3xl border-none outline-none",
          className
        )}
        alt="Icon"
        loading="lazy"
      />
    );
  else if (trimmed.startsWith("<svg") || trimmed.startsWith("<?xml"))
    return (
      <div
        className={cn("grow flex justify-center items-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-[2rem] [&>svg]:max-h-[2rem] [&>svg]:fill-current", className)}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(trimmed) }}
      />
    );
  else
    return <FaCode className={cn("w-12 h-12", className)} />;
};

export default RenderIcon;
