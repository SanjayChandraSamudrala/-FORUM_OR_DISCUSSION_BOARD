import MainLayout from "../components/MainLayout";
import Header from "../components/Header";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <MainLayout initialIsLoggedIn={true}>
      <Header title="About ConnectForum">
        <p>Learn about our platform and community guidelines</p>
      </Header>
      
      <div className="about-container">
        <div className="feature-grid">
          <div className="feature-card feature-card-purple">
            <h3 className="feature-title">#Free Speech</h3>
            <p className="feature-text">
              You may or may not like or dislike any discussion, but never act on your will.
            </p>
          </div>
          
          <div className="feature-card feature-card-pink">
            <h3 className="feature-title">#Trust</h3>
            <p className="feature-text">
              This platform appreciates every user's trust as long as it's reasonable and legal.
            </p>
          </div>
          
          <div className="feature-card feature-card-blue">
            <h3 className="feature-title">#Free Speech</h3>
            <p className="feature-text">
              You are free to speak, discuss, as long as you don't hurt other people.
            </p>
          </div>
        </div>
        
        <div className="section">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-text">
            ConnectForum is designed to be a platform where people can freely express ideas, engage in meaningful discussions, and build communities around shared interests.
          </p>
          <p className="section-text">
            We believe in the power of open dialogue and the exchange of diverse perspectives. Our mission is to create a safe, respectful environment where everyone feels welcome to participate.
          </p>
        </div>
        
        <div className="section">
          <h2 className="section-title">Community Guidelines</h2>
          <ul className="guidelines-list">
            <li className="guidelines-item">Be respectful to others, even when disagreeing</li>
            <li className="guidelines-item">No hate speech, harassment, or personal attacks</li>
            <li className="guidelines-item">Do not share misleading or false information</li>
            <li className="guidelines-item">Respect copyright and intellectual property rights</li>
            <li className="guidelines-item">No spamming or excessive self-promotion</li>
            <li className="guidelines-item">Help create a positive and constructive atmosphere</li>
          </ul>
        </div>
        
        <div className="cta-container">
          <h2 className="cta-title">Join the Conversation</h2>
          <p className="cta-text">
            Ready to dive in? Start exploring threads, join discussions, or create your own topics to share with the community.
          </p>
          <div className="cta-buttons">
            <a href="/threads" className="cta-button-purple">
              Explore Threads
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage; 