import MainLayout from "../components/MainLayout";
import { useState, useMemo } from "react";
import { Search, HelpCircle, Book, MessageSquare, Settings, User, ChevronDown, Mail } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import "./HelpPage.css";

const helpTopics = [
  {
    id: "item-1",
    question: "How do I create an account?",
    answer: "To create an account, click on the 'Login' button at the top of the page, then select 'Register' option. Fill out the required information and submit the form."
  },
  {
    id: "item-2",
    question: "How do I create a thread?",
    answer: "To create a thread, navigate to the Threads page and use the post creation area at the top. Enter your content and click the 'POST' button. You must be logged in to create a thread."
  },
  {
    id: "item-3",
    question: "How do I save a thread?",
    answer: "To save a thread, click the save icon (bookmark) on the thread you want to save. Saved threads can be accessed from the 'Saved' section in the sidebar."
  },
  {
    id: "item-4",
    question: "How do I create a community?",
    answer: "To create a community, click on the 'Create Community' button in the sidebar. Fill in the details about your community and submit the form. You need to be logged in to create a community."
  },
  {
    id: "item-5",
    question: "How do I use emojis in my posts?",
    answer: "You can use emojis in your posts by clicking the emoji button in the post editor. A picker will appear where you can select from various emojis. You can also type ':' followed by the emoji name."
  },
  {
    id: "item-6",
    question: "How do I format my posts?",
    answer: "You can format your posts using the formatting toolbar above the text editor. Options include bold, italic, bullet points, and numbered lists. You can also use markdown syntax for formatting."
  },
  {
    id: "item-7",
    question: "How do likes and dislikes work?",
    answer: "You can like or dislike posts and replies by clicking the thumbs up/down icons. You must be logged in to use these features. Your vote will be highlighted in purple when active."
  }
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Filter topics based on search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery) return helpTopics;
    const query = searchQuery.toLowerCase();
    return helpTopics.filter(topic => 
      topic.question.toLowerCase().includes(query) || 
      topic.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleCategoryClick = (category) => {
    switch (category) {
      case 'guides':
        // Scroll to FAQ section
        document.querySelector('.help-content').scrollIntoView({ behavior: 'smooth' });
        break;
      case 'community':
        navigate('/community');
        break;
      case 'contact':
        navigate('/contact');
        break;
      default:
        break;
    }
  };

  return (
    <MainLayout initialIsLoggedIn={isLoggedIn}>
      <div>
        <div className="header-container">
          <h1 className="header-title">Help & Support</h1>
          <p className="header-subtitle">Find answers to your questions and get assistance</p>
        </div>

        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search for help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="help-categories">
          <button 
            className="category-button"
            onClick={() => handleCategoryClick('guides')}
          >
            <Book size={28} className="category-icon" />
            <span className="category-title">User Guides</span>
            <span className="category-subtitle">How to use the platform</span>
          </button>
          
          <button 
            className="category-button"
            onClick={() => handleCategoryClick('community')}
          >
            <MessageSquare size={28} className="category-icon" />
            <span className="category-title">Community Forum</span>
            <span className="category-subtitle">Ask the community</span>
          </button>
          
          <button 
            className="category-button"
            onClick={() => handleCategoryClick('contact')}
          >
            <Mail size={28} className="category-icon" />
            <span className="category-title">Contact Support</span>
            <span className="category-subtitle">Get direct help</span>
          </button>
        </div>

        <div className="help-content">
          <div className="content-section">
            <h2 className="section-title">
              {searchQuery ? `Search Results (${filteredTopics.length})` : 'Frequently Asked Questions'}
            </h2>
            
            {filteredTopics.length === 0 ? (
              <div className="no-results">
                <HelpCircle size={48} className="no-results-icon" />
                <p>No results found for "{searchQuery}"</p>
                <Button 
                  onClick={() => navigate('/contact')}
                  className="contact-support-btn"
                >
                  Contact Support
                </Button>
              </div>
            ) : (
              <Accordion type="single" collapsible>
                {filteredTopics.map(topic => (
                  <AccordionItem key={topic.id} value={topic.id} className="faq-item">
                    <AccordionTrigger className="accordion-trigger">
                      {topic.question}
                      <ChevronDown className="chevron-icon" size={20} />
                    </AccordionTrigger>
                    <AccordionContent className="accordion-content">
                      {topic.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpPage; 