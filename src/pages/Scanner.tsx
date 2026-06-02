import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ArrowLeft, CameraOff, Loader2, Scan } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { AROverlay } from "@/components/AROverlay";
import { Footer } from "@/components/Footer";
import { useCameraStream } from "@/lib/camera/useCameraStream";
import { useSignRecognitionPreload } from "@/hooks/useSignRecognition";
import {
  saveRecognitionResult,
  signRecognitionEngine,
} from "@/lib/signRecognition";

type ScanPhase = "idle" | "capturing" | "processing";

export default function Scanner() {
  const [, setLocation] = useLocation();
  const { videoRef, phase, isLive, errorMessage, startCamera, stopCamera } =
    useCameraStream();
  const { ready: recognitionReady, error: recognitionPreloadError } =
    useSignRecognitionPreload();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanPhase, setScanPhase] = useState<ScanPhase>("idle");
  const [processingError, setProcessingError] = useState<string | null>(null);

  const captureEnabled = isLive && recognitionReady && scanPhase === "idle";

  const captureImage = useCallback(async () => {
    if (!isLive || !videoRef.current || !canvasRef.current) return;
    if (!recognitionReady) {
      setProcessingError("Sign library is still loading. Please wait.");
      return;
    }

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      setProcessingError("Camera feed is not ready yet. Wait for the live preview.");
      return;
    }

    setScanPhase("capturing");
    setProcessingError(null);

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setProcessingError("Could not read camera frame.");
      setScanPhase("idle");
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    stopCamera();
    setScanPhase("processing");

    try {
      sessionStorage.setItem("capturedImage", dataUrl);
      const matchResult = await signRecognitionEngine.match(dataUrl);
      saveRecognitionResult(matchResult);
      setLocation("/result");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[signRecognition] capture match failed", err);
      setProcessingError(
        err instanceof Error ? err.message : "Sign matching failed. Please try again."
      );
      setScanPhase("idle");
      await startCamera();
    }
  }, [isLive, recognitionReady, stopCamera, setLocation, startCamera, videoRef]);

  const showProcessing = scanPhase === "processing";
  const showStarting = phase === "starting" && !showProcessing;
  const showError = phase === "error" && !showProcessing;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <button
              data-testid="button-back"
              onClick={() => {
                stopCamera();
                setLocation("/");
              }}
              className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-primary">
              <span className="relative flex h-2 w-2">
                {isLive && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    isLive ? "bg-primary" : "bg-muted-foreground"
                  }`}
                />
              </span>
              {showProcessing
                ? "MATCHING..."
                : isLive
                  ? "LIVE"
                  : showError
                    ? "ERROR"
                    : "STARTING"}
            </div>
          </div>

          {/* Camera viewport — video always mounted */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/50">
            <canvas ref={canvasRef} className="hidden" aria-hidden />

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 z-[1] h-full w-full object-cover ${
                isLive ? "opacity-100" : "opacity-0"
              }`}
              data-testid="video-camera-feed"
            />

            {isLive && scanPhase === "idle" && (
              <div className="absolute inset-0 z-[2] pointer-events-none">
                <AROverlay />
              </div>
            )}

            <AnimatePresence>
              {showStarting && (
                <motion.div
                  key="starting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-4 bg-background/90 backdrop-blur-sm"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="px-6 text-center">
                    <p className="font-mono text-sm text-muted-foreground">
                      REQUESTING CAMERA PERMISSION…
                    </p>
                    <p className="mt-2 max-w-sm text-xs text-muted-foreground">
                      Allow camera access when your browser asks. This can take a moment on
                      first use.
                    </p>
                  </div>
                </motion.div>
              )}

              {showProcessing && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur-md"
                >
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <div className="text-center">
                    <p className="font-mono text-sm font-bold text-primary">PROCESSING</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Matching against sign library…
                    </p>
                  </div>
                </motion.div>
              )}

              {showError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-5 bg-background/95 p-8 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
                    <CameraOff className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <p className="mb-1 font-bold text-destructive">Camera Unavailable</p>
                    <p
                      className="mx-auto max-w-md break-words text-sm text-muted-foreground"
                      data-testid="text-camera-error"
                    >
                      {errorMessage ?? "Unknown camera error"}
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground/80">
                      Use HTTPS (or localhost). On iPhone, use Safari/Chrome and allow Camera in
                      Settings → browser → site permissions.
                    </p>
                  </div>
                  <button
                    type="button"
                    data-testid="button-retry-camera"
                    onClick={() => {
                      setProcessingError(null);
                      void startCamera();
                    }}
                    className="rounded-xl border border-primary/30 bg-primary/10 px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <AnimatePresence>
              {isLive && scanPhase === "idle" && (
                <motion.button
                  key="capture"
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  data-testid="button-capture"
                  onClick={() => void captureImage()}
                  disabled={!captureEnabled}
                  className="group relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/40 bg-primary/10 transition-all hover:border-primary hover:bg-primary/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 transition-shadow group-hover:shadow-primary/60 group-disabled:shadow-none">
                    <Camera className="h-6 w-6 text-primary-foreground" />
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
            {!isLive && phase !== "error" && "Waiting for live camera preview…"}
            {isLive && !recognitionReady && "Live feed ready — loading sign library…"}
            {captureEnabled && "POINT AT RAILWAY SIGN — TAP TO CAPTURE"}
            {isLive && recognitionReady && scanPhase !== "idle" && "Processing…"}
          </p>

          {(processingError || recognitionPreloadError) && (
            <p className="mx-auto mt-3 max-w-md text-center text-xs text-destructive">
              {processingError ?? recognitionPreloadError}
            </p>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
