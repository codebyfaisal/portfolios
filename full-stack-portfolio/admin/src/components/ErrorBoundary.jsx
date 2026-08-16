import React, { Component } from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";
import { Button, Card } from "@/components";

class ErrorBoundary extends Component {
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
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 text-center">
          <Card className="max-w-lg w-full shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <FaExclamationTriangle className="text-3xl text-destructive" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              An unexpected error occurred. Our team has been notified.
            </p>

            <Card className="bg-muted/50 mb-6 text-left overflow-auto max-h-48">
              <p className="font-mono text-destructive text-sm mb-2">
                {this.state.error && this.state.error.toString()}
              </p>
              <details className="text-muted-foreground text-xs font-mono cursor-pointer">
                <summary className="hover:text-foreground transition-colors">
                  Stack Trace Details
                </summary>
                <div className="mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
              </details>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FaRedo />
                Refresh Page
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
