import React, { useState } from "react";
import { Input } from "@/components";
import axios from "@/api/axios";
import toast from "react-hot-toast";
import { FaArrowRight } from "react-icons/fa";
import { cn } from "@/utils/cn";
import usePortfolioStore from "@/store/usePortfolioStore";

const Newsletter = ({ className }) => {
  const { rounded } = usePortfolioStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    setLoading(true);
    try {
      await axios.post("/subscribers/subscribe", { email });
      toast.success("Successfully subscribed to the newsletter!");
      setEmail("");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to subscribe. Please try again.";

      if (error.response?.status === 409) toast(message, { icon: "ℹ️" });
      else toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section>
      <div
        className={cn(
          "flex flex-col md:flex-row items-center justify-center gap-4 bg-card p-6 md:p-10 xl:p-14 border border-border",
          rounded,
        )}
      >
        <div className="w-full md:w-1/2">
          <h3 className="text-2xl font-bold text-foreground">
            Subscribe to my newsletter
          </h3>
          <p className="text-muted-foreground max-w-md">
            Get the latest articles, tutorials, and updates delivered straight
            to your inbox.
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <div className={cn("w-full", className)}>
            <form onSubmit={handleSubmit} className="relative group">
              <div
                className={cn(
                  "absolute -inset-0.5 bg-linear-to-r from-transparent via-secondary/5 to-secondary opacity-30 group-hover:opacity-100 transition duration-300 blur-sm",
                  rounded,
                )}
              />
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className={cn(
                    "px-6 py-4 border-input focus:border-ring placeholder:text-muted-foreground",
                    rounded,
                  )}
                  required
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 bg-foreground text-background hover:bg-muted-foreground transition-colors px-4 py-2 flex items-center gap-2 font-medium disabled:opacity-50",
                    rounded,
                  )}
                  aria-label="Subscribe"
                >
                  {loading ? (
                    "Subscribing..."
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <FaArrowRight size={12} />
                    </>
                  )}
                </button>
              </div>
            </form>
            <p className="mt-3 text-xs text-muted-foreground pl-1">
              Join our community of developers. No spam, ever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
