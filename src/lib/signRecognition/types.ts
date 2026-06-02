import type { RailwaySign } from "@/data/railwaySigns";

/** Result returned by the recognition engine (TF.js can implement the same interface later). */
export interface SignMatchResult {
  recognized: boolean;
  sign: RailwaySign | null;
  /** 0–100 for UI */
  confidence: number;
  /** 0–1 raw combined score */
  score: number;
  secondBestScore: number;
  algorithm: "dhash-histogram-v1";
}

export interface SignRecognitionEngine {
  readonly name: string;
  preload(): Promise<void>;
  match(imageDataUrl: string): Promise<SignMatchResult>;
}
