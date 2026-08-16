import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import usePortfolioStore from "@/store/usePortfolioStore";
import {
  FaArrowLeft,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { RenderIcon, SEO, DetailSkeleton, NotFound } from "@/components";
import { cn } from "@/utils/cn";

const ServiceDetail = () => {
  const { id } = useParams();
  const { data, rounded, loading } = usePortfolioStore();

  const service = data?.services?.find((s) => s._id === id);

  return (
    <>
      <SEO
        title={service?.title}
        description={service?.description}
        keywords={[service?.title, "Service", "Web Development"]}
      />

      {loading ? (
        <DetailSkeleton />
      ) : !service ? (
        <NotFound
          title="No Service Found"
          description="I'm currently working on some exciting new services. Check back soon!"
          backgroundText="EMPTY"
          link="/services"
          backTo="Back to Services"
          showBackgroundBubbles={false}
          className="my-10"
          rounded={rounded}
        />
      ) : (
        <div className="space-y-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-foreground hover:text-secondary mb-6 transition"
            title="Back to Services"
          >
            <FaArrowLeft /> Back to Services
          </Link>

          {/* Hero Section */}
          <section className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {service.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {service.description}
            </p>
          </section>

          <div className="grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-4">
            <div className="col-span-1 lg:col-span-3 grid gap-10">
              {/* Why Choose Me Section */}
              {service.whyChooseMe && service.whyChooseMe.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-foreground">
                    Why Choose Me?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {service.whyChooseMe.map((item, index) => (
                      <div
                        key={index}
                        className={cn(
                          "bg-card p-6 border border-border hover:-translate-y-1 transition-transform duration-300",
                          rounded,
                        )}
                      >
                        <div
                          className={cn(
                            "w-12 h-12 bg-secondary/20 flex items-center justify-center mb-4",
                            rounded,
                          )}
                        >
                          <RenderIcon
                            icon={item.icon || "mdi:star"}
                            className="text-2xl text-secondary"
                          />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Section */}
              {service.techStack && service.techStack.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-foreground">
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-6">
                    {service.techStack.map((stack, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "px-6 py-4 bg-card border border-border flex items-center gap-3",
                          rounded,
                        )}
                      >
                        <RenderIcon icon={stack.icon || "mdi:code-tags"} />
                        <span className="text-lg font-medium text-foreground">
                          {stack.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-1 lg:col-span-1">
              {/* Features Grid */}
              {service.features && service.features.length > 0 && (
                <>
                  <h3 className="text-2xl font-bold mb-6 text-foreground">
                    Key Features
                  </h3>
                  <div
                    className={cn(
                      "grid gap-2 py-5 px-3 w-full max-w-lg bg-card border border-border",
                      rounded,
                    )}
                  >
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 group">
                        <span
                          className={cn(
                            "p-2 bg-primary/20 text-foreground/50 group-hover:text-foreground group-hover:bg-primary transition-colors shrink-0",
                            rounded,
                          )}
                        >
                          <FaCheck size={12} />
                        </span>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Process Section */}
          {service.process && service.process.length > 0 && (
            <>
              <h3 className="text-2xl font-bold mb-6 text-foreground text-center">
                My Process
              </h3>
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {service.process.map((step, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group"
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-10 h-10 border border-secondary bg-card text-secondary shadow shrink-0 md:order-1 md:group-even:-translate-x-1/2 md:group-odd:translate-x-1/2",
                        rounded,
                      )}
                    >
                      <span className="text-sm font-bold">{idx + 1}</span>
                    </div>
                    {/* Card */}
                    <div
                      className={cn(
                        "w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-card border border-secondary/20",
                        rounded,
                      )}
                    >
                      <h3 className="text-lg font-bold mb-2 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* FAQ Section */}
          {service.faq && service.faq.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-foreground text-center">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {service.faq.map((item, idx) => (
                  <FAQItem
                    key={idx}
                    question={item.question}
                    answer={item.answer}
                    rounded={rounded}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const FAQItem = ({ question, answer, rounded }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn("border border-border bg-card overflow-hidden", rounded)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-medium text-foreground hover:bg-card transition-colors"
        aria-expanded={isOpen}
      >
        {question}
        {isOpen ? (
          <FaChevronUp className="text-muted-foreground" />
        ) : (
          <FaChevronDown className="text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 text-muted-foreground border-t border-border">
          {answer}
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
