import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/react";
import { ui } from "@clerk/ui";
import App from "./App.jsx";
import { LocalUserProvider } from "./utils/localUser.jsx";
import { ToastProvider } from "./components/Toast.jsx";
import "./styles/index.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Missing #root element in index.html");
}

const root = ReactDOM.createRoot(rootEl);

if (!publishableKey) {
  root.render(
    <React.StrictMode>
      <div className="min-h-screen bg-sand text-ink flex items-center justify-center px-6">
        <div className="max-w-lg rounded-3xl border border-ink/10 bg-white/80 p-8 shadow-premium animate-scale-in">
          <h1 className="text-2xl font-semibold">Missing Clerk publishable key</h1>
          <p className="mt-3 text-sm text-ink/70">
            Create <code className="rounded bg-ink/5 px-1.5 py-0.5">.env</code> in <code className="rounded bg-ink/5 px-1.5 py-0.5">client/</code> with
            <code className="block mt-2 rounded-xl bg-ink/5 px-3 py-2 text-xs">VITE_CLERK_PUBLISHABLE_KEY=your_key_here</code>
            then restart the dev server.
          </p>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={publishableKey} ui={ui}>
        <BrowserRouter>
          <ToastProvider>
            <LocalUserProvider>
              <App />
            </LocalUserProvider>
          </ToastProvider>
        </BrowserRouter>
      </ClerkProvider>
    </React.StrictMode>
  );
}
