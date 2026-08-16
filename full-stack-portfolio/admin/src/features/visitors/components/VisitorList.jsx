import React from "react";
import {
  FaGlobe,
  FaSortUp,
  FaSortDown,
  FaClock,
  FaEye,
  FaTrash,
  FaFilter,
} from "react-icons/fa";
import { Button, Input } from "@/components";
import { motion } from "motion/react";
import VisitorSkeleton from "./VisitorSkeleton";

const VisitorList = ({
  visits,
  isLoading,
  selected,
  sorting,
  onSelectAll,
  onSelectOne,
  onSort,
  onDelete,
  onView,
  meta,
}) => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-4xl">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 py-4 pr-4 bg-muted text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border items-center sticky top-0 z-10 rounded-t-xl">
          <Input
            type="checkbox"
            checked={visits.length > 0 && selected.length === visits.length}
            onChange={onSelectAll}
            className="col-span-1"
          />
          <div
            className="col-span-2 cursor-pointer hover:text-primary flex items-center gap-1"
            onClick={() => onSort("ip")}
          >
            IP{" "}
            {sorting.sortBy === "ip" &&
              (sorting.sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
          </div>
          <div
            className="col-span-3 cursor-pointer hover:text-primary flex items-center gap-1"
            onClick={() => onSort("location.country")}
          >
            Location{" "}
            {sorting.sortBy === "location.country" &&
              (sorting.sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
          </div>
          <div
            className="col-span-3 cursor-pointer hover:text-primary flex items-center gap-1"
            onClick={() => onSort("page")}
          >
            Page{" "}
            {sorting.sortBy === "page" &&
              (sorting.sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
          </div>
          <div
            className="col-span-2 cursor-pointer hover:text-primary flex items-center gap-1"
            onClick={() => onSort("createdAt")}
          >
            Time{" "}
            {sorting.sortBy === "createdAt" &&
              (sorting.sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
          </div>
          <div className="col-span-1 text-right pr-1">Action</div>
        </div>

        {/* List  */}
        <div className="divide-y divide-border">
          {isLoading ? (
            <VisitorSkeleton />
          ) : visits.length > 0 ? (
            visits.map((visit, index) => (
              <motion.div
                key={visit._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`grid grid-cols-12 gap-4 py-4 pr-4 items-center hover:bg-muted/20 transition-colors ${
                  selected.includes(visit._id) ? "bg-muted/5" : ""
                }`}
              >
                <Input
                  type="checkbox"
                  checked={selected.includes(visit._id)}
                  onChange={() => onSelectOne(visit._id)}
                  className="col-span-1"
                />
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <FaGlobe className="text-muted-foreground shrink-0" />
                    <p
                      className="text-foreground font-mono text-xs truncate"
                      title={visit.ip}
                    >
                      {visit.ip}
                    </p>
                  </div>
                </div>
                <div className="col-span-3">
                  <p
                    className="text-muted-foreground truncate text-xs"
                    title={`${visit.location?.city || ""} ${
                      visit.location?.country || ""
                    }`}
                  >
                    {visit.location?.city
                      ? `${visit.location.city}, ${visit.location.country}`
                      : "Unknown Location"}
                  </p>
                </div>
                <div
                  className="col-span-3 text-muted-foreground font-mono text-xs truncate"
                  title={visit.page}
                >
                  {visit.page}
                </div>
                <div className="col-span-2 text-muted-foreground flex items-center gap-2 text-xs">
                  <FaClock className="text-muted-foreground shrink-0" />
                  <span className="truncate">
                    {new Date(visit.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    uiType="action"
                    onClick={() => onView(visit)}
                    title="View Details"
                    icon={<FaEye />}
                  />
                  <Button
                    uiType="action"
                    onClick={() => onDelete(visit._id)}
                    title="Delete"
                    icon={<FaTrash />}
                  />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center h-full bg-card border border-border rounded-b-xl overflow-hidden">
              <FaGlobe className="mb-2 text-2xl opacity-20" />
              <p>No visits found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorList;
