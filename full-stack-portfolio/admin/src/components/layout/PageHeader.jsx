import { useEffect } from "react";
import useDashboardStore from "@/store/useDashboardStore";

const PageHeader = ({ title, description, children }) => {
  useEffect(() => {
    useDashboardStore.setState({
      pageHeader: {
        title,
        description,
        actions: children,
      },
    });

    return () => {
      useDashboardStore.setState({
        pageHeader: {
          title: "",
          description: "",
          actions: null,
        },
      });
    };
  }, [title, description]);

  return null;
};

export default PageHeader;
