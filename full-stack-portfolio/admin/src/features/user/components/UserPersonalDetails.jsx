import React from "react";

import { FaUser } from "react-icons/fa";
import { Card, Input, Textarea } from "@/components";
import UserPersonalDetailsSkeleton from "./UserSkeleton";

const UserPersonalDetails = ({
  formData,
  handleChange,
  className,
  isLoading,
}) => {
  return (
    <Card className={className}>
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
        <FaUser className="text-primary" /> Personal Details
      </h3>

      {isLoading ? (
        <UserPersonalDetailsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          <Input
            label="First Name"
            name="name.first"
            value={formData.name.first}
            onChange={handleChange}
          />
          <Input
            label="Last Name"
            name="name.last"
            value={formData.name.last}
            onChange={handleChange}
          />
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <Textarea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={8}
            className="col-span-full"
          />
        </div>
      )}
    </Card>
  );
};

export default UserPersonalDetails;
