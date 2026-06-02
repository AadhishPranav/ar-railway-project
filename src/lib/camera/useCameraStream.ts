import { useCallback, useEffect, useRef, useState } from "react";

export type CameraPhase = "starting" | "live" | "error";

function logCamera(step: string, detail?: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.log(`[camera] ${step}`, detail ?? "");
}

function logCameraError(step: string, err: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[camera] ${step}`, {
    error: err,
    name: err instanceof Error ? err.name : undefined,
    message: err instanceof Error ? err.message : String(err),
    isSecureContext: typeof window !== "undefined" ? window.isSecureContext : undefined,
    hasMediaDevices: !!navigator.mediaDevices,
    hasGetUserMedia: !!navigator.mediaDevices?.getUserMedia,
  });
}

function formatGetUserMediaError(err: unknown): string {
  const name = err instanceof Error ? err.name : "UnknownError";
  const message = err instanceof Error ? err.message : String(err);
  switch (name) {
    case "NotAllowedError":
      return `Camera permission denied. (${name}) ${message}`;
    case "NotFoundError":
      return `No camera found on this device. (${name}) ${message}`;
    case "NotReadableError":
      return `Camera is in use by another app or tab. (${name}) ${message}`;
    case "SecurityError":
      return `Camera blocked for this page. Use HTTPS or localhost. (${name}) ${message}`;
    case "OverconstrainedError":
      return `Camera constraints not supported. (${name}) ${message}`;
    default:
      return `getUserMedia failed: ${name} — ${message}`;
  }
}

async function requestVideoStream(): Promise<MediaStream> {
  const baseVideo = {
    facingMode: { ideal: "environment" as const },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  try {
    return await navigator.mediaDevices.getUserMedia({
      video: baseVideo,
      audio: false,
    });
  } catch (first) {
    logCameraError("getUserMedia with environment camera failed, retrying default", first);
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  }
}

function waitForVideoFrames(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      video.removeEventListener("loadeddata", onFrame);
      video.removeEventListener("playing", onFrame);
      video.removeEventListener("error", onVideoError);
    };

    const onFrame = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        cleanup();
        resolve();
      }
    };

    const onVideoError = () => {
      cleanup();
      reject(new Error("Video element failed to load camera frames"));
    };

    video.addEventListener("loadeddata", onFrame);
    video.addEventListener("playing", onFrame);
    video.addEventListener("error", onVideoError);
  });
}

/**
 * Minimal camera hook: request permission, attach stream, play video, expose live state.
 * No timeouts — the browser controls permission duration.
 */
export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  const startingRef = useRef(false);

  const [phase, setPhase] = useState<CameraPhase>("starting");
  const [isLive, setIsLive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    setIsLive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        logCamera("track stopped", {
          kind: track.kind,
          label: track.label,
          readyState: track.readyState,
        });
        track.stop();
      });
      streamRef.current = null;
    }
    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (startingRef.current) {
      logCamera("start skipped — already starting");
      return;
    }

    const video = videoRef.current;
    if (!video) {
      logCameraError("video element not in DOM yet", null);
      setErrorMessage("Camera preview element is not ready. Reload the page.");
      setPhase("error");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      const msg =
        "Camera API unavailable: navigator.mediaDevices.getUserMedia is not supported.";
      logCameraError(msg, null);
      setErrorMessage(msg);
      setPhase("error");
      return;
    }

    startingRef.current = true;
    stopCamera();
    setPhase("starting");
    setErrorMessage(null);
    setIsLive(false);

    logCamera("requesting camera", {
      origin: window.location.origin,
      isSecureContext: window.isSecureContext,
      userAgent: navigator.userAgent,
    });

    try {
      const stream = await requestVideoStream();

      if (!mountedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;
      const videoTrack = stream.getVideoTracks()[0];
      logCamera("permission granted / stream received", {
        trackCount: stream.getTracks().length,
        videoTrack: videoTrack
          ? {
              label: videoTrack.label,
              readyState: videoTrack.readyState,
              settings: videoTrack.getSettings(),
            }
          : null,
      });

      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;

      video.srcObject = stream;
      logCamera("video srcObject assigned");

      const playPromise = video.play();
      if (playPromise) {
        await playPromise;
      }
      logCamera("video.play() resolved");

      await waitForVideoFrames(video);

      if (!mountedRef.current) return;

      const track = stream.getVideoTracks()[0];
      if (!track || track.readyState !== "live") {
        throw new Error(
          `Video track is not live (readyState=${track?.readyState ?? "none"})`
        );
      }

      logCamera("video playing", {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState,
        paused: video.paused,
      });

      setIsLive(true);
      setPhase("live");
    } catch (err) {
      logCameraError("camera start failed", err);
      stopCamera();
      if (mountedRef.current) {
        setErrorMessage(formatGetUserMediaError(err));
        setPhase("error");
      }
    } finally {
      startingRef.current = false;
    }
  }, [stopCamera]);

  useEffect(() => {
    mountedRef.current = true;
    logCamera("mount — waiting for video element");

    const startWhenReady = () => {
      if (videoRef.current) {
        void startCamera();
      } else {
        requestAnimationFrame(startWhenReady);
      }
    };

    startWhenReady();

    return () => {
      mountedRef.current = false;
      logCamera("unmount — stopping camera");
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return {
    videoRef,
    phase,
    isLive,
    errorMessage,
    startCamera,
    stopCamera,
  };
}
