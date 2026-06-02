import { useEffect, useState } from "react";
import { signRecognitionEngine } from "@/lib/signRecognition";

export function useSignRecognitionPreload() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    signRecognitionEngine
      .preload()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("[signRecognition] preload failed", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { ready, error };
}
