import React from "react";
import { Provider } from "react-redux";
import { HashRouter, Link } from "react-router-dom"; 
import store from "./store";
import AppRouter from "./routes/AppRouter";
import "./styles/global.css";

const Navbar = () => {
  const navStyle = {
    background: "#0b1220",
    borderBottom: "1px solid rgba(255,255,255,0.03)",
    padding: "14px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 6px 18px rgba(2,6,23,0.6)",
  };

  const logoStyle = {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: "#f8fafc",
    letterSpacing: "-0.5px",
  };

  const linksWrap = {
    display: "flex",
    gap: 20,
    alignItems: "center",
  };

  const linkBase = {
    color: "#cbd5e1",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 15,
    padding: "6px 10px",
    borderRadius: 8,
    transition: "all 0.12s ease",
  };

  const linkHover = (e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.02)";
    e.currentTarget.style.color = "#fff";
    e.currentTarget.style.transform = "translateY(-1px)";
  };

  const linkLeave = (e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.color = linkBase.color;
    e.currentTarget.style.transform = "none";
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={logoStyle}>TalentFlow</h1>
      </div>

      <div style={linksWrap}>
        <Link
          to="/jobs"
          style={linkBase}
          onMouseEnter={linkHover}
          onMouseLeave={linkLeave}
        >
          Jobs
        </Link>
        <Link
          to="/candidates"
          style={linkBase}
          onMouseEnter={linkHover}
          onMouseLeave={linkLeave}
        >
          Candidates
        </Link>
        <Link
          to="/assessments"
          style={linkBase}
          onMouseEnter={linkHover}
          onMouseLeave={linkLeave}
        >
          Assessments
        </Link>
      </div>
    </nav>
  );
};

const AppLayout = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(180deg,#07101a,#0b1220)",
      color: "#e6eef8",
    }}
  >
    <Navbar />
    <main style={{ flex: 1 }}>{children}</main>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <AppLayout>
          <AppRouter />
        </AppLayout>
      </HashRouter>
    </Provider>
  );
}

export default App;
