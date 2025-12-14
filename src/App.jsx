import { useState } from "react";
import "./App.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const shortenUrl = async () => {
    if (!longUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(longUrl);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setLoading(true);
    setError("");
    setShortLink("");
    setCopied(false);

    try {
      const res = await fetch("	https://5gf2pyvzya.execute-api.us-east-1.amazonaws.com/shorten", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: longUrl.trim()
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Server error: ${res.status}`);
      }

      const code = await res.text();
      if (code && code.trim()) {
        setShortLink(`https://shortIt/${code.trim()}`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      shortenUrl();
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">URL Shortener</h1>
        <p className="app-subtitle">Transform long URLs into short, shareable links</p>

        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter your long URL here..."
              value={longUrl}
              onChange={(e) => {
                setLongUrl(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className="url-input"
              disabled={loading}
            />
            <button 
              onClick={shortenUrl} 
              className="shorten-button"
              disabled={loading || !longUrl.trim()}
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {shortLink && (
            <div className="result-section">
              <div className="result-label">Your shortened URL:</div>
              <div className="short-link-container">
                <a 
                  href={shortLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="short-link"
                >
                  {shortLink}
                </a>
                <button 
                  onClick={copyToClipboard}
                  className="copy-button"
                  title="Copy to clipboard"
                >
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
