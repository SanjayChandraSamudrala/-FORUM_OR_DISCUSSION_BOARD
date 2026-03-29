import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { registerUser } from "@/services/api";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "You must agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await registerUser({ name, email, password });
      
      // Store the token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast({
        title: "Success",
        description: `Welcome ${response.data.user.name}! Your account has been created.`,
      });
      
      navigate("/");
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.error || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1A1F2C] p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Register</h1>
        <p className="text-gray-400 text-center mb-8">
          Join our community to start discussions and connect with others
        </p>
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-400 mb-2">Name</label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Yayan Cool"
              className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-white"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yayan@durian.cc"
              className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-white"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-400 mb-2">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••••••"
              className="w-full bg-gray-800 border-gray-700 text-white placeholder:text-white"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="agree-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 bg-gray-800 border-gray-700 rounded"
              disabled={isLoading}
            />
            <label htmlFor="agree-terms" className="ml-2 text-gray-400">
              Agree with terms and conditions
            </label>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-purple-400 hover:bg-purple-500 text-white font-medium py-3 px-4 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Register"}
          </Button>
        </form>
        
        <p className="text-center text-gray-400 mt-6">
          Have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage; 