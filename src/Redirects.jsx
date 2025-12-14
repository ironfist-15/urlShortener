import { useEffect, useState } from "react";
import "./App.css";

function Redirect() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = window.location.pathname.replace("/", "").trim();

    if (!code) {
      setError("Invalid short URL code");
      setLoading(false);
      return;
    }

    fetch(`https://5gf2pyvzya.execute-api.us-east-1.amazonaws.com/${code}`)
      .then((res) => {
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(text || `Error: ${res.status}`);
          });
        }
        return res.text();
      })
      .then((result) => {
        const trimmedResult = result.trim();
        if (trimmedResult.startsWith("http://") || trimmedResult.startsWith("https://")) {
          // Redirect to the URL
          window.location.href = trimmedResult;
        } else {
          setError(trimmedResult || "Invalid redirect URL");
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to redirect. The link may be invalid or expired.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="redirect-container">
        <div className="redirect-content">
          <div className="spinner"></div>
          <p className="redirect-message">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="redirect-container">
        <div className="redirect-content">
          <div className="error-icon-large">⚠️</div>
          <h2 className="error-title">Redirect Failed</h2>
          <p className="error-text">{error}</p>
          <a href="/" className="home-link">← Back to Home</a>
        </div>
      </div>
    );
  }

  return null;
}

export default Redirect;
