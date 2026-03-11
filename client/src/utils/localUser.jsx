import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/react";
import { authedRequest } from "./request.js";

const LocalUserContext = createContext(null);

export function LocalUserProvider({ children }) {
  const { isSignedIn, isLoaded: userLoaded } = useUser();
  const { getToken, isLoaded: authLoaded } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState(null);

  const fetchLocalUser = async () => {
    if (!isSignedIn) {
      setLocalUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    let attempts = 0;
    const maxAttempts = 3;
    let lastError = null;

    while (attempts < maxAttempts) {
      try {
        const res = await authedRequest(getToken, { method: "get", url: "/api/users/me" });
        setLocalUser(res.data.user);
        setLoading(false);
        setDebugError(null);
        return;
      } catch (err) {
        attempts++;
        lastError = err?.response?.data?.error || err.message || "Unknown error";
        console.warn("Failed to fetch local user:", lastError);
        
        if (attempts >= maxAttempts) {
          setLocalUser(null);
          setLoading(false);
          setDebugError(`Failed after 3 attempts. Last error: ${lastError}`);
        } else {
          // wait 1.5 seconds before retrying
          await new Promise(r => setTimeout(r, 1500));
        }
      }
    }
  };

  useEffect(() => {
    // Don't do anything until Clerk is fully loaded
    if (!userLoaded || !authLoaded) return;
    fetchLocalUser();
  }, [isSignedIn, userLoaded, authLoaded]);

  const value = useMemo(() => ({ localUser, loading, debugError, refresh: fetchLocalUser }), [localUser, loading, debugError]);

  return <LocalUserContext.Provider value={value}>{children}</LocalUserContext.Provider>;
}

export function useLocalUser() {
  return useContext(LocalUserContext);
}
