import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { loginUser } from "@/services/api";
import "./LoginPage.css";
import logo from "../assets/logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await loginUser({ email, password });
      
      // Store user data and token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role
      }));
      localStorage.setItem('loginTimestamp', Date.now().toString());

      toast({
        title: "Success",
        description: `Welcome back, ${response.data.user.name}!`,
      });
      
      navigate("/threads");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.error || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left side - Gradient banner */}
      <div className="login-banner">
        <div className="banner-logo-container">
          <img 
            src={logo}
            alt="Logo" 
            className="banner-logo"
            style={{ width: "75px", height: "75px", borderRadius: "50%" }} 
          />
          <h2 className="banner-title">ConnectForum.IO</h2>
        </div>

        <h1 className="banner-heading">ConnectForum – Where Ideas Spark and Conversations Thrive!</h1>
        
        <p className="banner-text">
          Join a vibrant community, share insights, and engage in meaningful discussions. Log in now and be part of the conversation!
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="login-form-container">
        <div className="login-form-content">
          <h1 className="login-heading">Login</h1>
          <p className="login-subheading">
            Welcome back! Please enter your credentials to access your account.
          </p>
          
          {/* Email login form */}
          <form onSubmit={handleLogin}>
            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yayan@durian.cc"
                className="login-form-input"
                disabled={isLoading}
              />
            </div>

            <div className="login-form-group">
              <div className="password-header">
                <label htmlFor="password" className="login-form-label">Password</label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••••••"
                className="login-form-input"
                disabled={isLoading}
              />
            </div>

            <div className="remember-me">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="remember-checkbox"
              />
              <label htmlFor="remember-me" className="remember-label">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="register-link-container">
            Don't have an account?{" "}
            <Link to="/register" className="register-link">
              Create one!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 