import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Button, Card } from "@/components";
import { motion } from "motion/react";

const PlanList = ({ plans, onEdit, onDelete }) => {
  return plans?.map((plan, index) => (
    <Card
      key={plan._id}
      className="overflow-hidden w-full max-w-md mx-auto md:mx-0"
      padding="p-0"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className="flex flex-col h-full"
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {plan.name}
          </h2>
          <h2 className="text-2xl font-bold text-primary">
            {plan.price?.currency} {plan.price?.min}
            {plan.price?.max && ` - ${plan.price.max}`}
          </h2>
        </div>

        <div className="p-6 bg-muted/30 grow">
          <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4">
            Features
          </h3>
          <ul className="space-y-2 mb-4">
            {plan.features?.map((feature, fIndex) => (
              <li
                key={fIndex}
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0"></span>
                {feature}
              </li>
            ))}
          </ul>

          {plan.addOns?.show && plan.addOns.options?.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-muted-foreground uppercase mb-4 mt-6 border-t border-border pt-4">
                Add-Ons
              </h3>
              <ul className="space-y-2">
                {plan.addOns.options.map((addon, aIndex) => (
                  <li
                    key={aIndex}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                    {addon}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="flex justify-center gap-2 py-2">
          <Button
            onClick={() => onEdit(plan)}
            uiType="action"
            icon={<FaEdit />}
            label="Edit"
            title="Edit Plan"
          />
          <Button
            onClick={() => onDelete(plan._id)}
            uiType="action"
            icon={<FaTrash />}
            label="Delete"
            title="Delete Plan"
          />
        </div>
      </motion.div>
    </Card>
  ));
};

export default PlanList;
