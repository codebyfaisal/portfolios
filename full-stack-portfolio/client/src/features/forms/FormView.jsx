import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "@/api/axios";
import { Skeleton, ApplicationForm, NotFound, PageHeader } from "@/components";
import usePortfolioStore from "@/store/usePortfolioStore";
import { cn } from "@/utils/cn";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const SkeletonLoader = () => (
  <div className="min-h-screen pt-32 max-w-4xl mx-auto space-y-3">
    <Skeleton className="h-12 w-64" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <div className="space-y-4 pt-8">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  </div>
);

const FormView = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { rounded } = usePortfolioStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data } = await axios.get(`/forms/${id}`);
        setForm(data.data);
      } catch (error) {
        console.error("Failed to fetch form", error);
        setError(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  if (isLoading) return <SkeletonLoader />;

  if (!form && !isLoading)
    return (
      <NotFound
        title="Form Not Found"
        description={
          error ||
          "The form you are looking for does not exist or has been removed."
        }
        backgroundText="404"
        link="/"
        rounded={rounded}
      />
    );

  const createTitle = () => {
    const title = form.title.split(" ");
    return {
      start: title.slice(0, title.length - 2).join(" "),
      middle: title[title.length - 2],
      end: title[title.length - 1],
    };
  };

  return (
    <section className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title={createTitle()}
        description={form?.description}
        className="max-w-3xl"
      />

      {form.isActive &&
      (!form.expiryDate || new Date(form.expiryDate) > new Date()) ? (
        <ApplicationForm formId={form._id} questions={form.questions} />
      ) : (
        <div className="text-center">
          <div
            className={cn(
              "inline-block px-6 py-4 bg-card border border-border mb-6",
              rounded,
            )}
          >
            <p className="text-secondary">
              {form.expiryDate && new Date(form.expiryDate) < new Date()
                ? "This form has expired."
                : "This form is currently not accepting submissions."}
            </p>
          </div>
          <div>
            <Link
              to="/"
              className={cn(
                "bg-secondary text-foreground px-6 py-3 hover:bg-transparent hover:border-border hover:border flex items-center gap-2 w-max mx-auto",
                rounded,
              )}
            >
              <span className="translate-y-0.5">
                <FaHome />
              </span>
              Return to Home
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default FormView;
