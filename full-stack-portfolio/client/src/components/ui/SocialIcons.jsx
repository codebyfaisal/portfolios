import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaDribbble,
  FaBehance,
  FaMedium,
  FaGlobe,
} from "react-icons/fa";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";

const socialIcons = {
  github: {
    icon: FaGithub,
    color: "hover:text-gray-600",
  },
  linkedin: {
    icon: FaLinkedin,
    color: "hover:text-blue-700",
  },
  twitter: {
    icon: FaTwitter,
    color: "hover:text-blue-600",
  },
  instagram: {
    icon: FaInstagram,
    color:
      "hover:text-white hover:bg-linear-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] rounded-3xl overflow-hidden",
  },
  facebook: {
    icon: FaFacebook,
    color: "hover:text-blue-600",
  },
  youtube: {
    icon: FaYoutube,
    color: "hover:text-red-600",
  },
  dribbble: {
    icon: FaDribbble,
    color:
      "hover:text-pink-500 after:content-[''] after:absolute after:inset-0 after:size-full after:bg-pink-500 after:rounded-3xl after:transition-all after:duration-300 after:scale-90 hover:[&_svg]:text-white z-10 after:-z-1 after:opacity-0 hover:after:opacity-100",
  },
  behance: {
    icon: FaBehance,
    color: "hover:text-blue-600",
  },
  medium: { icon: FaMedium },
  website: { icon: FaGlobe },
};

const SocialIcons = ({ social, url }) => {
  const Icon = socialIcons[social];
  const rounded = usePortfolioStore((state) => state.rounded);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative size-6 flex items-center justify-center hover:scale-110 transition-all duration-300",
        rounded,
        Icon?.color,
      )}
      aria-label={social}
      title={social}
    >
      {Icon ? (
        <Icon.icon className="transition-colors duration-300 w-full h-full" />
      ) : (
        <span className="font-medium capitalize">{social}</span>
      )}
    </a>
  );
};

export default SocialIcons;
