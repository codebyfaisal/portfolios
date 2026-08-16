import React from "react";
import { FaEdit, FaTrash, FaQuoteLeft } from "react-icons/fa";
import { Button, Card } from "@/components";
import { motion } from "motion/react";

const TestimonialList = ({ testimonials, onEdit, onDelete }) => {
  return testimonials.map((testimonial, index) => (
    <Card key={testimonial._id} className="max-w-md w-full mx-auto relative pb-2">
      <FaQuoteLeft className="absolute top-6 right-6 text-border text-4xl" />
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex flex-col h-full"
      >
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-border"
          />
          <div>
            <h3 className="font-bold text-foreground">{testimonial.name}</h3>
            <p className="text-xs text-primary">{testimonial.role}</p>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-6 relative z-10 leading-relaxed grow">
          "{testimonial.text}"
        </p>

        {(testimonial.hasVideo || testimonial.video) && (
          <Card
            className="mb-4 relative z-10 w-full overflow-hidden"
            padding=""
          >
            {testimonial.videoType === "video" ? (
              <video
                src={testimonial.videoUrl || testimonial.video}
                controls
                className="w-full aspect-video object-cover"
              />
            ) : (
              <iframe
                src={testimonial.videoUrl || testimonial.video}
                title="Testimonial Video"
                className="w-full aspect-video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </Card>
        )}

        <div className="flex justify-end gap-2 mt-auto">
          <Button
            onClick={() => onEdit(testimonial)}
            uiType="action"
            icon={<FaEdit />}
            label="Edit"
            title="Edit Testimonial"
            className="h-max"
          />
          <Button
            onClick={() => onDelete(testimonial._id)}
            uiType="action"
            icon={<FaTrash />}
            label="Delete"
            title="Delete Testimonial"
            className="h-max"
          />
        </div>
      </motion.div>
    </Card>
  ));
};

export default TestimonialList;
