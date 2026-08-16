import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button, Card, RenderIcon } from "@/components";
import defaultIcons from "@/defaultIcons";
import { motion } from "motion/react";

const ServiceList = ({ services, onEdit, onDelete, onToggleFeature }) => {
  return services.map((service, index) => (
    <Card
      key={service._id}
      className="overflow-hidden w-full h-fit max-w-md mx-auto md:mx-0 relative"
      padding=""
    >
      {/* Featured Toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-1.5 rounded-md border border-border shadow-sm">
        <label className="text-[10px] font-bold text-muted-foreground cursor-pointer select-none">
          FEATURED
        </label>
        <input
          type="checkbox"
          checked={service.isFeatured}
          onChange={() => onToggleFeature(service)}
          className="rounded border-border bg-muted text-primary focus:ring-primary cursor-pointer w-3.5 h-3.5"
          title="Toggle Featured on Home Page"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex flex-col justify-between h-full gap-4 text-center mt-6"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-lg text-2xl p-4 pt-6 relative">
            <RenderIcon
              icon={service.icon}
              defaultIcon={defaultIcons.service}
            />
          </div>

          <h2 className="text-xl font-bold text-foreground px-4">
            {service.title}
          </h2>
          <p className="text-muted-foreground text-sm px-4">
            {service.description}
          </p>
        </div>
        <div className="flex justify-center gap-2 bg-muted w-full p-2 mt-4">
          <Button
            onClick={() => onEdit(service)}
            uiType="text"
            icon={<FaEdit size={12} />}
            label="Edit"
          />
          <Button
            onClick={() => onDelete(service._id)}
            uiType="text"
            icon={<FaTrash size={12} />}
            label="Delete"
          />
        </div>
      </motion.div>
    </Card>
  ));
};

export default ServiceList;
