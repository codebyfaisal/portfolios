import React, { useState } from "react";
import useDashboardStore from "@/store/useDashboardStore";
import { useNavigate } from "react-router-dom";
import { Input, Button, Card } from "@/components";
import { FaSignInAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const Login = () => {
  const { login, isLoadingAuth, authError } = useDashboardStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Invalid password");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md" padding="p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome Back
        </h1>
        <p className="text-muted-foreground mb-6">
          Enter your admin password to manage your portfolio.
        </p>

        {authError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg mb-6 text-sm">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Admin Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ password: e.target.value })
            }
            required
            disabled={isLoadingAuth}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            uiType="primary"
            disabled={isLoadingAuth}
            loading={isLoadingAuth}
            icon={<FaSignInAlt size={12} />}
            label={isLoadingAuth ? "Verifying Password..." : "Sign In"}
            className="w-full"
          />
        </form>
      </Card>
    </div>
  );
};

export default Login;
