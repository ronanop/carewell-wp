/**
 * Lightweight review report shape (Studio removed — type kept for document models).
 */
export type ExperienceReviewReport = {
  score?: number;
  summary?: string;
  findings?: Array<{
    code: string;
    severity: "info" | "warn" | "error";
    message: string;
  }>;
};
