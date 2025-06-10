import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import ThreadsPage from "./pages/ThreadsPage";
import PostsPage from "./pages/PostsPage";
import ResponsePage from "./pages/ResponsePage";
import UserProfilePage from "./pages/UserProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import SavedPage from "./pages/SavedPage";
import CommunityPage from "./pages/CommunityPage";
import ContactPage from "./pages/ContactPage";
import HelpPage from "./pages/HelpPage";
import CategoryPage from "./pages/CategoryPage";
import TopicPage from "./pages/TopicPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AuthGuard from "./components/AuthGuard";
import AdminAuthGuard from "./components/AdminAuthGuard";
import CommunityDetailsPage from "./pages/CommunityDetailsPage";
import SearchResultsPage from "./pages/SearchResultsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthGuard><LoginPage /></AuthGuard>} />
          <Route path="/register" element={<AuthGuard><RegisterPage /></AuthGuard>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/threads" element={<ThreadsPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/response/:id" element={<ResponsePage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/topic/:topicName" element={<TopicPage />} />
          <Route path="/admin" element={<AdminAuthGuard><AdminPage /></AdminAuthGuard>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/community/:id" element={<CommunityDetailsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App; 