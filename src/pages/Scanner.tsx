import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ArrowLeft, CameraOff, Loader2, Scan } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { AROverlay } from "@/components/AROverlay";
import { Footer } from "@/components/Footer";

type ScanState =
  | "requesting"
  | "streaming"
  | "capturing"
  | "processing"
  | "error";

export default function Scanner() {
  const [, setLocation] = useLocation();
  const [scanState, setScanState] = useState<ScanState>("requesting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestTimeoutRef = useRef<number | null>(null);
  const isProduction = import.meta.env.PROD;

  const logCameraError = useCallback((context: string, err: unknown) => {
    const e = err as
      | (Error & { name?: string; message?: string })
      | { name?: string; message?: string }
      | unknown;

    // eslint-disable-next-line no-console
    console.error(`[camera] ${context}`, {
      error: e,
      isSecureContext: window.isSecureContext,
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!navigator.mediaDevices?.getUserMedia,
      userAgent: navigator.userAgent,
    });
  }, []);

  const startCamera = useCallback(async () => {
    try {
      if (requestTimeoutRef.current) {
        window.clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }

      // Stop any previous stream before requesting a new one
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      setScanState("requesting");
      setErrorMessage(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera API unavailable: navigator.mediaDevices.getUserMedia is not supported in this browser."
        );
      }

      if (!window.isSecureContext) {
        // eslint-disable-next-line no-console
        console.warn("[camera] Insecure context detected; attempting getUserMedia anyway", {
          hostname: window.location.hostname,
          origin: window.location.origin,
          mode: isProduction ? "production" : "development",
        });
      }

      // Prevent infinite loading if the browser never resolves/rejects.
      requestTimeoutRef.current = window.setTimeout(() => {
        const msg =
          "Camera request timed out. If you're on mobile, check site permissions and retry.";
        // eslint-disable-next-line no-console
        console.error("[camera] timeout", {
          msg,
          isSecureContext: window.isSecureContext,
          origin: window.location.origin,
        });
        setErrorMessage(msg);
        setScanState("error");
      }, 12000);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;

      if (requestTimeoutRef.current) {
        window.clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }

      // Move to streaming state even if video element isn't mounted yet.
      setScanState("streaming");
    } catch (err) {
      logCameraError("getUserMedia failed", err);
      const name = err instanceof Error ? err.name : undefined;
      const msg = err instanceof Error ? err.message : String(err);

      setErrorMessage(
        name === "NotAllowedError"
          ? `Camera access denied by browser/permissions. (${name}) ${msg}`
          : name === "SecurityError"
            ? isProduction
              ? `Camera blocked due to insecure origin in production. Please use HTTPS. (${name}) ${msg}`
              : `Browser blocked camera for this origin. In dev over LAN, switch to HTTPS if possible. (${name}) ${msg}`
          : name === "NotFoundError"
            ? `No camera device found. (${name}) ${msg}`
            : name === "NotReadableError"
              ? `Camera is already in use by another app/tab. (${name}) ${msg}`
              : name
                ? `Camera error: ${name} — ${msg}`
                : `Camera error: ${msg}`
      );
      setScanState("error");
    }
  }, [isProduction, logCameraError]);

  const stopCamera = useCallback(() => {
    if (requestTimeoutRef.current) {
      window.clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // Attach stream to video whenever both are ready.
  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;
    if (scanState !== "streaming" && scanState !== "capturing") return;

    try {
      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((err) => {
          logCameraError("video.play() rejected", err);
          setErrorMessage(
            `Unable to start video playback: ${err instanceof Error ? err.message : String(err)}`
          );
          setScanState("error");
        });
      }
    } catch (err) {
      logCameraError("attaching stream failed", err);
      setErrorMessage(
        `Unable to attach camera stream: ${err instanceof Error ? err.message : String(err)}`
      );
      setScanState("error");
    }
  }, [logCameraError, scanState]);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || scanState !== "streaming") return;
    setScanState("capturing");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    sessionStorage.setItem("capturedImage", dataUrl);
    stopCamera();

    setScanState("processing");
    setTimeout(() => {
      setLocation("/result");
    }, 2200);
  }, [scanState, stopCamera, setLocation]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              data-testid="button-back"
              onClick={() => { stopCamera(); setLocation("/"); }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-primary">
              <span className="relative flex h-2 w-2">
                {scanState === "streaming" && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                )}
                <span className={`relative inline-flex h-2 w-2 rounded-full ${scanState === "streaming" ? "bg-primary" : "bg-muted-foreground"}`} />
              </span>
              {scanState === "streaming" ? "CAMERA ACTIVE" : scanState === "processing" ? "ANALYZING..." : scanState === "error" ? "ERROR" : "INITIALIZING"}
            </div>
          </div>

          {/* Camera Viewport */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/50">
            <canvas ref={canvasRef} className="hidden" />

            <AnimatePresence mode="wait">
              {(scanState === "streaming" || scanState === "capturing") && (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative w-full h-full"
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    data-testid="video-camera-feed"
                  />
                  <AROverlay />
                </motion.div>
              )}

              {scanState === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md gap-6"
                >
                  <div className="relative">
                    <motion.div
                      className="h-20 w-20 rounded-full border-2 border-primary/20"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute inset-2 rounded-full border-t-2 border-primary"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Scan className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-sm text-primary font-bold">AI DETECTION IN PROGRESS</p>
                    <p className="text-xs text-muted-foreground mt-1">Processing captured image...</p>
                  </div>
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4].map((delay) => (
                      <motion.div
                        key={delay}
                        className="h-1.5 w-1.5 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {scanState === "requesting" && (
                <motion.div
                  key="requesting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                >
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground font-mono">
                      REQUESTING CAMERA PERMISSION...
                    </p>
                    <p className="mt-2 max-w-sm text-xs text-muted-foreground">
                      If you don’t see a prompt, check your browser site settings and allow Camera.
                    </p>
                  </div>
                </motion.div>
              )}

              {scanState === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center">
                    <CameraOff className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <p className="font-bold text-destructive mb-1">Camera Unavailable</p>
                    <p className="text-sm text-muted-foreground max-w-md break-words">
                      {errorMessage ?? "Unknown error"}
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground/80">
                      Tip: On mobile, use Chrome/Safari and ensure you’re on HTTPS (or localhost).
                    </p>
                  </div>
                  <button
                    data-testid="button-retry-camera"
                    onClick={startCamera}
                    className="rounded-xl border border-primary/30 bg-primary/10 px-6 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center">
            <AnimatePresence>
              {scanState === "streaming" && (
                <motion.button
                  key="capture"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  data-testid="button-capture"
                  onClick={captureImage}
                  className="group relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/40 bg-primary/10 transition-all hover:border-primary hover:bg-primary/20 active:scale-95"
                >
                  <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 group-hover:shadow-primary/60 transition-shadow">
                    <Camera className="h-6 w-6 text-primary-foreground" />
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {scanState === "streaming" && (
            <p className="mt-4 text-center text-xs text-muted-foreground font-mono">
              POINT CAMERA AT RAILWAY SIGN — PRESS BUTTON TO CAPTURE
            </p>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
