export const CONTENT_KINDS = ["track", "snippet", "mix", "comment"] as const;
export const PUBLISHABLE_CONTENT_KINDS = ["track", "snippet", "mix"] as const;
export const PROCESSING_STATUSES = ["queued", "analyzing", "ready", "failed", "blocked"] as const;

export type ContentKind = (typeof CONTENT_KINDS)[number];
export type PublishableContentKind = (typeof PUBLISHABLE_CONTENT_KINDS)[number];
export type ProcessingStatus = (typeof PROCESSING_STATUSES)[number];

export type ApiHealthResponse = {
  ok: boolean;
  service: "api" | "web" | "audio-worker";
  checkedAt?: string;
};

export type AudioAnalysis = {
  bpm: number | null;
  musicalKey: string | null;
  camelotKey: string | null;
  beatGrid: number[];
  energyCurve: number[];
  waveformPeaks: number[];
  confidence: number | null;
};
