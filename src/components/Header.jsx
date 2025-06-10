import "./Header.css";

const Header = ({ title, children }) => {
  return (
    <div className="header-container">
      <h1 className="header-title">{title}</h1>
      {children && <div className="header-subtitle">{children}</div>}
    </div>
  );
};

export default Header; 