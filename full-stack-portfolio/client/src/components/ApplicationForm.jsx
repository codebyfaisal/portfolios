import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "@/api/axios";
import { Button, Input, Select, Textarea } from "@/components";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";

const ApplicationForm = ({ jobId, formId, questions }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { rounded } = usePortfolioStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = questions
        ?.map((q) => ({
          questionId: q.id,
          label: q.label,
          answer: formData.answers?.[q.id],
        }))
        .filter((a) => a.answer !== undefined && a.answer !== "");

      const payload = {
        ...formData,
        jobId,
        formId,
        answers: formattedAnswers || [],
      };

      await axios.post("/applications", payload);
      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Application failed", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <div
        className={cn(
          "bg-card border border-emerald-500/20 p-8 text-center",
          rounded
        )}
      >
        <div className={cn("w-16 h-16 bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6", rounded)}>
          <FaCheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Application Received!
        </h3>
        <p className="text-foreground mb-6">
          Thanks for applying. We'll review your application and get back to you
          soon.
        </p>
        <button
          onClick={() => setSubmitStatus(null)}
          className="text-emerald-500 font-medium hover:underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn("border border-border md:p-8", rounded)}
    >
      <h3 className="text-2xl font-bold text-foreground mb-6">
        Apply for this Position
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Helper for Error Message */}
        {submitStatus === "error" && (
          <div
            className={cn(
              "p-4 bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500",
              rounded
            )}
          >
            <FaTimesCircle className="shrink-0" />
            <p className="text-sm">
              Something went wrong. Please try again later.
            </p>
          </div>
        )}

        <Input
          label="Full Name *"
          {...register("fullName", {
            required: "Name is required",
          })}
          error={errors.fullName?.message}
          placeholder="John Doe"
        />

        <Input
          type="email"
          label="Email Address *"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
          })}
          error={errors.email?.message}
          placeholder="john@example.com"
        />

        <Input
          type="url"
          label={`Resume Link (URL) ${jobId ? "*" : ""}`}
          {...register("resumeLink", {
            required: jobId ? "Resume link is required" : false,
          })}
          error={errors.resumeLink?.message}
          placeholder="https://drive.google.com/..."
        >
          <p className="text-xs text-foreground/50">
            Please provide a public link to your resume (Google Drive, Dropbox,
            etc).
          </p>
        </Input>

        <Input
          type="url"
          label="Portfolio Link (Optional)"
          {...register("portfolioLink")}
          error={errors.portfolioLink?.message}
          placeholder="https://john.design"
        />

        <Textarea
          label="Cover Letter / Why should we hire you? *"
          {...register("coverLetter", {
            required: "Please tell us a bit about yourself",
          })}
          rows={5}
          error={errors.coverLetter?.message}
          placeholder="Tell us about your experience and why you'd be a great fit..."
        />

        {/* Dynamic Questions */}
        {questions &&
          questions.length > 0 &&
          questions.map((q) => (
            <div key={q.id} className="space-y-2">
              {q.type === "textarea" ? (
                <Textarea
                  label={`${q.label} ${q.required ? "*" : ""}`}
                  {...register(`answers.${q.id}`, {
                    required: q.required ? "This field is required" : false,
                  })}
                  placeholder={q.placeholder}
                  rows={4}
                  error={errors.answers?.[q.id]?.message}
                />
              ) : q.type === "select" ? (
                <Select
                  label={`${q.label} ${q.required ? "*" : ""}`}
                  {...register(`answers.${q.id}`, {
                    required: q.required ? "Please select an option" : false,
                  })}
                  error={errors.answers?.[q.id]?.message}
                  className="capitalize"
                  placeholder="Select an option"
                  options={q.options}
                />
              ) : (
                <Input
                  type={q.type}
                  label={`${q.label} ${q.required ? "*" : ""}`}
                  {...register(`answers.${q.id}`, {
                    required: q.required ? "This field is required" : false,
                  })}
                  placeholder={q.placeholder}
                  error={errors.answers?.[q.id]?.message}
                />
              )}
            </div>
          ))}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Application</span>
              <FaPaperPlane size={16} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ApplicationForm;
