import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

export function useAuthSession(pollInterval = 2000) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

    const checkSession = async () => {
      try {
        const currentSession = await fetchAuthSession();
        if (currentSession?.tokens?.idToken) {
          setSession(currentSession);
          setLoading(false);
          if (interval) clearInterval(interval); // stop polling
        }
      } catch {
        // still no session, keep polling
      }
    };

    // Check immediately
    checkSession();

    // Then poll until available
    interval = setInterval(checkSession, pollInterval);

    return () => clearInterval(interval);
  }, [pollInterval]);

  return { session, loading };
}
