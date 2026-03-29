import MainLayout from "../components/MainLayout";
import Header from "../components/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { submitContactMessage } from "../services/api";
import "./ContactPage.css";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!name || !email || !message) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Send contact form data to backend
      await submitContactMessage({
        name,
        email,
        subject,
        message,
      });
      
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible!",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout initialIsLoggedIn={isLoggedIn}>
      <div>
        <Header title="Contact Us">
          <p>Get in touch with our team</p>
        </Header>

        <div className="contact-grid">
          <div>
            <h2 className="form-section-title">Send us a message</h2>
            <form onSubmit={handleSubmit} className="contact-space">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name *
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="Your name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Your email"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Subject
                </label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-input"
                  placeholder="Subject of your message"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message *
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea"
                  placeholder="Your message"
                  rows={4}
                />
              </div>
              
              <Button 
                type="submit" 
                className="form-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
          <div className="contact-space">
            <h2 className="contact-section-title">Contact Information</h2>
            
            <div className="contact-card">
              <div className="contact-icon-container">
                <Mail className="contact-icon" />
              </div>
              <div>
                <h3 className="contact-info-title">Email</h3>
                <p className="contact-info-text">support@connectforum.io</p>
                <p className="contact-info-text">info@connectforum.io</p>
              </div>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon-container">
                <Phone className="contact-icon" />
              </div>
              <div>
                <h3 className="contact-info-title">Phone</h3>
                <p className="contact-info-text">+1 (555) 123-4567</p>
                <p className="contact-info-text">+1 (555) 987-6543</p>
              </div>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon-container">
                <MapPin className="contact-icon" />
              </div>
              <div>
                <h3 className="contact-info-title">Address</h3>
                <p className="contact-info-text">123 Forum Street</p>
                <p className="contact-info-text">Tech City, TC 10101</p>
              </div>
            </div>
            
            <div className="hours-section">
              <h3 className="hours-title">Business Hours</h3>
              <p className="hours-text">Monday - Friday: 9am - 5pm</p>
              <p className="hours-text">Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage; 