import React, { useState } from "react";
import {
  FaGlobe,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaBehance,
  FaDribbble,
  FaMedium,
  FaYoutube,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { Input, Button, Select, Card } from "@/components";
import { cn } from "@/utils/cn";

const socialPlatforms = [
  {
    name: "Website",
    value: "website",
    icon: <FaGlobe />,
    link: "https://www.username.com",
  },
  {
    name: "GitHub",
    value: "github",
    icon: <FaGithub />,
    link: "https://github.com/",
  },
  {
    name: "LinkedIn",
    value: "linkedin",
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/in/",
  },
  {
    name: "Twitter",
    value: "twitter",
    icon: <FaTwitter />,
    link: "https://x.com/",
  },
  {
    name: "Instagram",
    value: "instagram",
    icon: <FaInstagram />,
    link: "https://www.instagram.com/",
  },
  {
    name: "Facebook",
    value: "facebook",
    icon: <FaFacebook />,
    link: "https://www.facebook.com/",
  },
  {
    name: "Behance",
    value: "behance",
    icon: <FaBehance />,
    link: "https://www.behance.net/",
  },
  {
    name: "Dribbble",
    value: "dribbble",
    icon: <FaDribbble />,
    link: "https://www.dribbble.com/",
  },
  {
    name: "Medium",
    value: "medium",
    icon: <FaMedium />,
    link: "https://www.medium.com/",
  },
  {
    name: "YouTube",
    value: "youtube",
    icon: <FaYoutube />,
    link: "https://www.youtube.com/",
  },
];

const UserSocials = ({ formData, setFormData, noOfSocials }) => {
  const [newSocialLink, setNewSocialLink] = useState({ platform: "", url: "" });

  const handleAddSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [newSocialLink.platform]: newSocialLink.url,
        },
      }));
      setNewSocialLink({ platform: "", url: "" });
    }
  };

  const handleRemoveSocialLink = (platform) => {
    const updatedLinks = { ...formData.socialLinks };
    delete updatedLinks[platform];
    setFormData((prev) => ({ ...prev, socialLinks: updatedLinks }));
  };

  return (
    <Card>
      <h3 className="text-lg font-bold text-foreground mb-6">
        Social Profiles
      </h3>

      {/* Add New Social Link */}
      <Card className="grid grid-cols-4 gap-4 mb-6 bg-muted/30" padding="p-4">
        <Select
          value={newSocialLink.platform}
          onChange={(e) =>
            setNewSocialLink({
              ...newSocialLink,
              platform: e.target.value,
            })
          }
          placeholder="Select Platform"
          options={socialPlatforms.map((p) => ({
            label: p.name,
            value: p.value,
            disabled: !!formData.socialLinks[p.value],
          }))}
          className="col-span-3"
        />
        <Button
          onClick={handleAddSocialLink}
          disabled={!newSocialLink.platform || !newSocialLink.url}
          uiType="primary"
          icon={<FaPlus size={14} />}
          label="Add"
          className="col-span-1 justify-center"
          style={{ padding: "0.6rem" }}
        />
        <Input
          value={newSocialLink.url}
          onChange={(e) =>
            setNewSocialLink({
              ...newSocialLink,
              url: e.target.value,
            })
          }
          placeholder={
            socialPlatforms.find((p) => p.value === newSocialLink.platform)
              ?.link
          }
          className="col-span-full"
        />
      </Card>

      {/* List of Added Links */}
      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          noOfSocials > 2 && "xs:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {Object.entries(formData.socialLinks).map(([platform, url]) => {
          const platformInfo = socialPlatforms.find(
            (p) => p.value === platform
          );
          if (!platformInfo) return null;

          return (
            <Card
              key={platform}
              className="flex items-center gap-4 p-4 bg-muted/40 border border-border rounded-xl group"
            >
              <Card
                className="w-10 h-10 flex items-center justify-center text-primary text-xl"
                title={url}
                rounded="rounded-lg"
                padding="p-0"
              >
                {platformInfo.icon}
              </Card>
              <div className="flex-1 min-w-0" title={url}>
                <h4 className="text-sm font-medium text-foreground capitalize">
                  {platformInfo.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">{url}</p>
              </div>
              <Button
                onClick={() => handleRemoveSocialLink(platform)}
                uiType="text"
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 w-auto"
                icon={<FaTrash />}
              />
            </Card>
          );
        })}
        {Object.keys(formData.socialLinks).length === 0 && (
          <Card className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            No social profiles added yet
          </Card>
        )}
      </div>
    </Card>
  );
};

export default UserSocials;
