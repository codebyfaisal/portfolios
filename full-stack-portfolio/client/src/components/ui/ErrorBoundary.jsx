import React from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";
import { Button } from "@/components";
import { cn } from "@/utils/cn";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen text-foreground flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-card backdrop-blur-xl border border-border p-8 max-w-lg w-full shadow-2xl rounded-3xl">
            <div className="mx-auto w-16 h-16 bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
              <FaExclamationTriangle className="text-3xl text-red-500" />
            </div>

            <h1 className="text-2xl font-bold mb-2 font-display">
              Something went wrong
            </h1>
            <p className="text-foreground mb-6 font-light">
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>

            <div className="p-4 mb-6 text-left overflow-auto max-h-48 border border-border rounded-2xl">
              <p className="font-mono text-red-400 text-sm mb-2 break-all">
                {this.state.error && this.state.error.toString()}
              </p>
              <details className="text-foreground text-xs font-mono cursor-pointer">
                <summary className="hover:text-foreground/50 transition-colors">
                  Technical Details
                </summary>
                <div className="mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
              </details>
            </div>

            <div className="flex justify-center">
              <Button onClick={this.handleReset} variant="primary">
                <FaRedo />
                <span className="translate-y-px ml-2">Refresh Page</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
