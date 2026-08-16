import React, { useEffect, useMemo, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import useDashboardStore from "@/store/useDashboardStore";
import {
  Overview,
  User,
  Services,
  Projects,
  Testimonials,
  Configuration,
  Messages,
  Login,
  FileManager,
  Plans,
  Blogs,
  Visitors,
  Jobs,
  JobApplications,
  Subscribers,
  Forms,
  Security,
} from "@/pages";
import { Layout, ErrorBoundary, LogoPulse } from "@/components";

import { Toaster } from "react-hot-toast";

const AuthGuard = ({ children }) => {
  const { user } = useDashboardStore();

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const PublicGuard = ({ children }) => {
  const { user } = useDashboardStore();

  if (user) return <Navigate to="/" replace />;
  return children;
};

import { ThemeProvider } from "@/context/ThemeContext";

function App() {
  const { checkAdminStatus, getUser } = useDashboardStore();
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState(null);

  const initApp = async () => {
    setInitError(null);
    setIsReady(false);
    try {
      await checkAdminStatus();
      await getUser();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Auth initialization failed:", err);
      }
      setInitError(
        "Failed to initialize application. Unable to connect to backend server.",
      );
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  const router = useMemo(() => {
    return createBrowserRouter(
      createRoutesFromElements(
        <>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicGuard>
                <Login />
              </PublicGuard>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
            errorElement={<ErrorBoundary />}
          >
            <Route
              index
              element={
                <ErrorBoundary>
                  <Overview />
                </ErrorBoundary>
              }
            />
            <Route
              path="user"
              element={
                <ErrorBoundary>
                  <User />
                </ErrorBoundary>
              }
            />
            <Route
              path="visitors"
              element={
                <ErrorBoundary>
                  <Visitors />
                </ErrorBoundary>
              }
            />
            <Route
              path="services"
              element={
                <ErrorBoundary>
                  <Services />
                </ErrorBoundary>
              }
            />
            <Route
              path="plans"
              element={
                <ErrorBoundary>
                  <Plans />
                </ErrorBoundary>
              }
            />
            <Route
              path="projects"
              element={
                <ErrorBoundary>
                  <Projects />
                </ErrorBoundary>
              }
            />
            <Route
              path="jobs"
              element={
                <ErrorBoundary>
                  <Jobs />
                </ErrorBoundary>
              }
            />
            <Route
              path="applications"
              element={
                <ErrorBoundary>
                  <JobApplications />
                </ErrorBoundary>
              }
            />
            <Route
              path="testimonials"
              element={
                <ErrorBoundary>
                  <Testimonials />
                </ErrorBoundary>
              }
            />

            <Route
              path="messages"
              element={
                <ErrorBoundary>
                  <Messages />
                </ErrorBoundary>
              }
            />
            <Route
              path="configuration"
              element={
                <ErrorBoundary>
                  <Configuration />
                </ErrorBoundary>
              }
            />
            <Route
              path="file-manager"
              element={
                <ErrorBoundary>
                  <FileManager />
                </ErrorBoundary>
              }
            />
            <Route
              path="files-manager"
              element={
                <ErrorBoundary>
                  <FileManager />
                </ErrorBoundary>
              }
            />
            <Route
              path="files"
              element={
                <ErrorBoundary>
                  <FileManager />
                </ErrorBoundary>
              }
            />
            <Route
              path="blogs"
              element={
                <ErrorBoundary>
                  <Blogs />
                </ErrorBoundary>
              }
            />
            <Route
              path="subscribers"
              element={
                <ErrorBoundary>
                  <Subscribers />
                </ErrorBoundary>
              }
            />
            <Route
              path="forms"
              element={
                <ErrorBoundary>
                  <Forms />
                </ErrorBoundary>
              }
            />
            <Route
              path="security"
              element={
                <ErrorBoundary>
                  <Security />
                </ErrorBoundary>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </>,
      ),
    );
  }, []);

  if (initError) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl space-y-2 max-w-md">
          <h2 className="text-xl font-bold text-destructive">
            Initialization Failed
          </h2>
          <p className="text-sm text-muted-foreground">{initError}</p>
          <button
            onClick={initApp}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!isReady)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LogoPulse />
      </div>
    );

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!bg-card !text-foreground !border !border-border",
          error: {
            className: "!border-destructive",
          },
        }}
      />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
