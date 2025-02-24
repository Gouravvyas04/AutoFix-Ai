import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css"; // Correct theme import
import Prism from "prismjs";
import axios from "axios";
import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";
import { FaSun, FaMoon } from "react-icons/fa";
import "./App.css";

function App() {
  const [code, setCode] = useState("function hello() {\n  console.log('Hello, world!');\n}");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false); // State for loading review response
  const [isLoadingApp, setIsLoadingApp] = useState(true); // Preloader for app startup

  // Simulate loading before showing main UI
  useEffect(() => {
    setTimeout(() => {
      setIsLoadingApp(false); // Hide preloader after 2.5 seconds
    }, 2500);
  }, []);

  // Run PrismJS to highlight code syntax
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    setReview("");

    try {
      const response = await axios.post("https://autofix-ai.onrender.com", { code });
      setReview(response.data);
    } catch (error) {
      console.error("Error reviewing code:", error);
      setReview("Failed to fetch review. Please try again.");
    }

    setLoading(false);
  }

  // State to manage dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Effect to update theme and store preference in localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      {/* Fullscreen Preloader */}
      {isLoadingApp ? (
        <div className="app-preloader">
          <h1>Fix Your Code</h1>
          <p>with <span>AutoFix AI</span></p>
        </div>
      ) : (
        <main>
          {/* Left Section - Code Editor */}
          <div className="left">
            <div className="code">
              <Editor
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => Prism.highlight(code, Prism.languages.javascript, "javascript")}
                padding={10}
                style={{
                  fontFamily: '"Fira Code", "Fira Mono", monospace',
                  fontSize: 16,
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  height: "100%",
                  width: "100%",
                  backgroundColor: darkMode ? "#2d2d2d" : "#f5f5f5",
                  color: darkMode ? "#ffffff" : "#000000",
                }}
              />
            </div>
            <button onClick={reviewCode} className="review">
              Review
            </button>
          </div>

          {/* Right Section - Review Output */}
          <div className="right">
            <div className="output">
              {loading ? (
                <div className="preloader">Let's Fix The Code....🚀</div>
              ) : (
                <Markdown>{review}</Markdown>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </main>
      )}
    </>
  );
}

export default App;
