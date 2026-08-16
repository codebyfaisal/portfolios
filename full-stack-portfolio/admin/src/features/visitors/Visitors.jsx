import React, { useEffect, useState, useRef } from "react";
import {
  FaUsers,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import useDashboardStore from "@/store/useDashboardStore";
import { UAParser } from "ua-parser-js";
import {
  Button,
  ConfirmationModal,
  Input,
  PageHeader,
  RightSidebar,
  Card,
} from "@/components";
import VisitorList from "./components/VisitorList";

const filterOptions = [
  {
    name: "ip",
    priority: 1,
    className: "col-span-4",
  },
  {
    name: "path",
    priority: 2,
    className: "col-span-4",
  },
  {
    name: "ua",
    priority: 3,
    className: "col-span-4",
  },
  {
    name: "country",
    priority: 3,
    className: "col-span-4",
  },
  {
    name: "city",
    priority: 4,
    className: "col-span-4",
  },
  {
    name: "region",
    priority: 5,
    className: "col-span-4",
  },
  {
    name: "startDate",
    priority: 6,
    className: "col-span-4",
  },
  {
    name: "endDate",
    priority: 7,
    className: "col-span-4",
  },
];

const DeleteButton = ({ className, onClick, label, Icon }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition-colors ${className}`}
    >
      <span className="flex items-center gap-1">
        {Icon} {label}
      </span>
    </button>
  );
};

const Visitors = () => {
  const {
    visits,
    visitorStats,
    isLoadingVisits,
    fetchVisitorStats,
    fetchVisits,
    deleteVisits,
    wipeAllVisits,
    resetStatsState,
  } = useDashboardStore();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    ip: "",
    country: "",
    region: "",
    city: "",
    path: "",
    ua: "",
  });
  const [sorting, setSorting] = useState({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [selected, setSelected] = useState([]);
  const [viewVisit, setViewVisit] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showWipeModal, setShowWipeModal] = useState(false);

  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    const filtersChanged =
      JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);

    const fetchData = () => {
      fetchVisits({
        page,
        limit: 10,
        ...filters,
        ...sorting,
      });
      prevFiltersRef.current = filters;
    };

    if (filtersChanged) {
      const timer = setTimeout(fetchData, 500);
      return () => clearTimeout(timer);
    } else {
      fetchData();
    }
  }, [page, filters, sorting]);

  useEffect(() => {
    fetchVisitorStats();
    return () => resetStatsState();
  }, [fetchVisitorStats, resetStatsState]);

  const visitsList = visits?.visits || [];
  const meta = visits?.meta || {};

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSort = (field) => {
    setSorting((prev) => ({
      sortBy: field,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(visitsList.map((v) => v._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Delete ${selected.length} visits?`)) return;
    try {
      await deleteVisits(selected);
      setSelected([]);
      fetchVisits({ page, limit: 10, ...filters, ...sorting });
      fetchVisitorStats();
    } catch (error) {
      alert("Failed to delete visits");
    }
  };

  const handleDeleteVisit = async (id) => {
    if (!window.confirm("Delete this visit?")) return;
    try {
      await deleteVisits([id]);
      fetchVisits({ page, limit: 10, ...filters, ...sorting });
      fetchVisitorStats();
    } catch (error) {
      alert("Failed to delete visit");
    }
  };

  const stats = [
    {
      label: "Unique (Today)",
      value: visitorStats?.uniqueVisitorsToday || 0,
      icon: FaUsers,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Visits",
      value: visitorStats?.totalVisits || 0,
      icon: FaChartLine,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-4 relative">
      <PageHeader
        title="Visitor Analytics"
        description="Track and analyze traffic patterns."
      />

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="flex items-center gap-3"
            padding="px-4 py-3"
          >
            <div className={`p-2 rounded-md ${stat.bg} ${stat.color}`}>
              <stat.icon />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="font-bold text-lg leading-none">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Card */}
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center justify-start flex-wrap gap-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            uiType="secondary"
            icon={<FaFilter />}
            label="Filters"
          />
          <DeleteButton
            onClick={() => setShowWipeModal(true)}
            label="Wipe All"
            Icon={<FaTrash />}
            title="Hard Delete All Data"
          />
          {selected.length > 0 && (
            <DeleteButton
              onClick={handleDeleteSelected}
              label={`Delete (${selected.length})`}
              Icon={<FaTrash />}
              title="Delete Selected"
              className="bg-red-500/10"
            />
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          Showing {visitsList.length} of {meta.total || 0}
        </div>
      </div>

      {/* Right Sidebar Filters */}
      <RightSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Visitors"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              uiType="secondary"
              label="Clear All"
              onClick={() =>
                setFilters({
                  startDate: "",
                  endDate: "",
                  ip: "",
                  country: "",
                  region: "",
                  city: "",
                  path: "",
                  ua: "",
                })
              }
            />
            <Button
              uiType="primary"
              label="Apply Filters"
              onClick={() => setShowFilters(false)}
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          {filterOptions
            .sort((a, b) => a.priority - b.priority)
            .map((option) => (
              <div key={option.name} className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase">
                  {option.name === "ip"
                    ? "IP Address"
                    : option.name === "path"
                      ? "Page Path"
                      : option.name === "ua"
                        ? "User Agent"
                        : option.name.charAt(0).toUpperCase() +
                          option.name.slice(1)}
                </label>
                <Input
                  type={
                    option.name.toLowerCase().includes("date") ? "date" : "text"
                  }
                  name={option.name}
                  value={filters[option.name]}
                  onChange={handleFilterChange}
                  placeholder={`Filter by ${option.name}...`}
                  className="w-full"
                />
              </div>
            ))}
        </div>
      </RightSidebar>

      <div className="w-full flex-1 min-h-0 overflow-hidden flex flex-col">
        <VisitorList
          visits={visitsList}
          isLoading={isLoadingVisits}
          selected={selected}
          sorting={sorting}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onSort={handleSort}
          onDelete={handleDeleteVisit}
          onView={setViewVisit}
          meta={meta}
        />
      </div>

      {/* Pagination */}
      <div className="pt-1 flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors text-foreground"
        >
          <FaChevronLeft /> Previous
        </button>

        <span className="text-sm text-muted-foreground">
          Page <span className="text-foreground font-medium">{page}</span> of{" "}
          {meta.totalPages || 1}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
          disabled={page >= (meta.totalPages || 1)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors text-foreground"
        >
          Next <FaChevronRight />
        </button>
      </div>

      {/* Details Modal */}
      {viewVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card
            className="w-full max-w-lg shadow-2xl overflow-hidden"
            padding="p-0"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">
                Visit Details
              </h2>
              <button
                onClick={() => setViewVisit(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase">
                    IP Address
                  </label>
                  <p className="text-foreground font-mono text-sm">
                    {viewVisit.ip}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase">
                    Timestamp
                  </label>
                  <div className="text-foreground text-sm">
                    <p>{new Date(viewVisit.createdAt).toLocaleString()}</p>
                    <p>{new Date(viewVisit.createdAt).toUTCString()}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground uppercase">
                    Page
                  </label>
                  <p className="text-foreground font-mono text-sm break-all">
                    {viewVisit.page}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground uppercase">
                    Location
                  </label>
                  <p className="text-foreground text-sm">
                    {viewVisit.location?.city}, {viewVisit.location?.region},{" "}
                    {viewVisit.location?.country}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground uppercase">
                    User Agent
                  </label>
                  <div className="flex flex-col gap-1">
                    <p className="text-foreground text-sm font-medium">
                      {(() => {
                        const parser = new UAParser(viewVisit.userAgent);
                        return `${parser.getBrowser().name || "Unknown"} ${
                          parser.getBrowser().version || ""
                        } on ${parser.getOS().name || "Unknown"} ${
                          parser.getOS().version || ""
                        }`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
              <button
                onClick={() => setViewVisit(null)}
                className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </Card>
        </div>
      )}

      <ConfirmationModal
        isOpen={showWipeModal}
        onClose={() => setShowWipeModal(false)}
        onConfirm={() => {
          wipeAllVisits();
          setShowWipeModal(false);
        }}
        isDangerous={true}
        title="Wipe All Data?"
        message="WARNING: This will permanently delete ALL visitor history and force all users to re-log. This action cannot be undone. Are you absolutely sure?"
        confirmText="Yes, Wipe Everything"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Visitors;
