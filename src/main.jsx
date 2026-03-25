import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Unexpected error" };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minHeight: "100vh",
            background: "#0a0a0f",
            color: "#f3f4f6",
            display: "grid",
            placeItems: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              maxWidth: 620,
              background: "#13131d",
              border: "1px solid #24243a",
              borderRadius: 16,
              padding: "1rem",
            }}
          >
            <h1 style={{ marginTop: 0 }}>Ghosted 👻 failed to load</h1>
            <p style={{ color: "#9ca3af" }}>
              A runtime error occurred. Please refresh or clear site storage.
            </p>
            <pre style={{ whiteSpace: "pre-wrap", color: "#f59e0b" }}>
              {this.state.message}
            </pre>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
