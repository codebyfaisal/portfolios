import React from "react";
import { Link } from "react-router-dom";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";
import { FaEnvelope } from "react-icons/fa";
import { Skeleton, BentoItem, ContactIllustration } from "@/components";
import { siteConfig } from "@/config/siteConfig";

const ContactPreview = ({ className }) => {
  const { rounded, loading } = usePortfolioStore();

  if (loading) {
    return (
      <BentoItem
        className={cn(className)}
        header={<Skeleton className="w-full h-full min-h-24" />}
        title={<Skeleton className="h-6 w-32" />}
        description={<Skeleton className="h-4 w-48 mt-2" />}
      />
    );
  }

  const { title, description, button } =
    siteConfig?.pages?.home?.universe?.contact;

  return (
    <BentoItem
      className={cn(className)}
      title={title}
      description={description}
      header={<ContactIllustration />}
      icon={<FaEnvelope className="h-10 w-10 text-secondary" />}
    >
      <Link
        to="/contact"
        className={cn(
          "mt-4 block w-full text-center px-4 py-2.5 bg-secondary text-foreground text-sm font-bold hover:opacity-90 transition",
          rounded
        )}
      >
        {button}
      </Link>
    </BentoItem>
  );
};

export default ContactPreview;
