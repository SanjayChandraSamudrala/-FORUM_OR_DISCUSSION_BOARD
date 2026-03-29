import { Link } from "react-router-dom";
import Header from "../components/Header";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <Header title="404">
        <p>Oops, we couldn't find this page</p>
      </Header>
      
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-message">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="home-button"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage; 