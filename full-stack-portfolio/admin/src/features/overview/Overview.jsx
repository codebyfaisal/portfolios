import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDashboardStore from "@/store/useDashboardStore";
import {
  FaProjectDiagram,
  FaServicestack,
  FaEnvelope,
  FaUsers,
  FaChartLine,
  FaNewspaper,
} from "react-icons/fa";
import { Button, Card, PageHeader } from "@/components";
import OverviewSkeleton from "./components/OverviewSkeleton";
import { motion } from "motion/react";

const Overview = () => {
  const {
    overview,
    visitorStats,
    isLoadingOverview,
    getUser,
    fetchOverviewStats,
    fetchVisitorStats,
    markMessageRead,
    resetStatsState,
  } = useDashboardStore();
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
    fetchOverviewStats();
    fetchVisitorStats();

    return () => resetStatsState();
  }, [fetchOverviewStats, fetchVisitorStats, getUser, resetStatsState]);

  const stats = [
    {
      label: "Unique Visitors (Today)",
      value: visitorStats?.uniqueVisitorsToday || 0,
      icon: FaUsers,
      color: "text-blue-500",
    },
    {
      label: "Total Visits",
      value: visitorStats?.totalVisits || 0,
      icon: FaChartLine,
      color: "text-purple-500",
    },
    {
      label: "Total Projects",
      value: overview?.counts?.projects || 0,
      icon: FaProjectDiagram,
      color: "text-primary",
    },
    {
      label: "Active Services",
      value: overview?.counts?.services || 0,
      icon: FaServicestack,
      color: "text-emerald-500",
    },
    {
      label: "Total Messages",
      value: overview?.counts?.messages || 0,
      icon: FaEnvelope,
      color: "text-amber-500",
    },
    {
      label: "Total Blog Posts",
      value: overview?.counts?.posts || 0,
      icon: FaNewspaper,
      color: "text-pink-500",
    },
  ];

  const handleMarkRead = async (id) => {
    await markMessageRead(id);
    fetchOverviewStats();
    toast.success("Message marked as read");
  };

  return (
    <div>
      <PageHeader title="Overview" description="Here's what's happening with your portfolio today." />

      {isLoadingOverview ? (
        <OverviewSkeleton />
      ) : !overview ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <p className="text-muted-foreground">Failed to load overview data.</p>
          <Button label="Retry" onClick={() => window.location.reload()} />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat) => (
                <Card
                  key={stat.label}
                  className="flex items-center justify-between group hover:border-primary transition-colors"
                >
                  <div>
                    <h3 className="text-muted-foreground text-sm font-medium">
                      {stat.label}
                    </h3>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div
                    className={`p-3 rounded-full bg-muted ${stat.color} group-hover:bg-muted/80 transition-colors`}
                  >
                    <stat.icon size={24} />
                  </div>
                </Card>
              ))}
            </div>
            {/* Right Column */}
            <Card>
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground font-medium text-lg">
                  Profile Health
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    overview?.health?.status === "Perfect"
                      ? "bg-emerald-500/20 text-emerald-500"
                      : overview?.health?.status === "Good"
                      ? "bg-primary/20 text-primary"
                      : overview?.health?.status === "Weak"
                      ? "bg-amber-500/20 text-amber-500"
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {overview?.health?.status || "Loading"}
                </span>
              </div>

              <div className="w-full bg-muted h-2 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full transition-all duration-1000 ${
                    overview?.health?.status === "Perfect"
                      ? "bg-emerald-500"
                      : overview?.health?.status === "Good"
                      ? "bg-primary"
                      : overview?.health?.status === "Weak"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${overview?.health?.score || 0}%` }}
                ></div>
              </div>

              {overview?.health?.checklist?.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-muted-foreground uppercase font-bold">
                    To Do List
                  </p>
                  <ul className="space-y-2">
                    {overview.health.checklist.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-foreground flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-emerald-500 font-medium">
                    All systems go! 🚀
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your profile is fully optimized.
                  </p>
                </div>
              )}
            </Card>

            {/* Recent Messages */}
            <div className="col-span-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Messages</h2>
                <Button
                  label="View All"
                  uiType="text"
                  onClick={() => navigate("/messages")}
                />
              </div>

              <Card padding="p-2">
                {overview?.recentMessages?.length > 0 ? (
                  <div className="divide-y divide-border">
                    {overview.recentMessages.map((msg) => (
                      <div
                        key={msg._id}
                        className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                            {(msg.from || "A").charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">
                              {msg.from || "Anonymous"}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {msg.status !== "read" && (
                            <button
                              onClick={() => handleMarkRead(msg._id)}
                              className="text-xs text-primary hover:text-primary/80"
                              title="Mark as Read"
                            >
                              Mark Read
                            </button>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No recent messages.
                  </div>
                )}
              </Card>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Overview;
