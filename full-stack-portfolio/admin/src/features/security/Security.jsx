import React from "react";
import { PageHeader } from "@/components";
import UserSecurity from "@/features/user/components/UserSecurity";

const Security = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & Sessions"
        description="Monitor active device sessions, security activity, and 30-day login history."
      />
      <UserSecurity />
    </div>
  );
};

export default Security;
