import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { requestPasswordReset } from "../services/api"; // Assuming this API function exists

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await requestPasswordReset(email);
      setMessage(response.data.message || "If an account with that email exists, we have sent a password reset link.");
      toast({
        title: "Success",
        description: "Password reset request sent. Check your email!",
      });
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to send password reset request.");
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to send password reset request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg bg-card text-card-foreground">
          <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
          <p className="text-center text-muted-foreground">
            Enter your email address to receive a password reset link.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          {message && (
            <p className="text-center text-sm" style={{ color: message.includes("Success") ? "green" : "red" }}>
              {message}
            </p>
          )}
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPasswordPage; 