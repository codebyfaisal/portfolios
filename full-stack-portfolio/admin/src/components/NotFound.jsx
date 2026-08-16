import React from "react";
import { Card } from "@/components";

const NotFound = ({ Icon, message, className = "" }) => {
  return (
    <Card
      padding="p-12"
      className={`text-center overflow-hidden text-muted-foreground ${className}`}
    >
      <Icon size={48} className="mx-auto text-4xl mb-4 opacity-20" />
      <p>{message}</p>
    </Card>
  );
};

export default NotFound;
