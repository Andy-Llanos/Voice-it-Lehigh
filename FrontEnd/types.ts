
export enum FeedbackCategory {
  COURSE = 'Course',
  CLUB = 'Club',
  GREEK_LIFE = 'Greek Life',
  CAMPUS_SERVICES = 'Campus Services',
  OTHER = 'Other'
}

export enum Sentiment {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative',
  NEUTRAL = 'Neutral'
}

export interface FeedbackItem {
  id: string;
  title: string;
  body: string;
  category: FeedbackCategory;
  sentiment: Sentiment;
  summary: string;
  timestamp: Date;
  organizationId: string; // e.g., 'CSE109', 'Ski Club'
}

export interface SentimentAnalysisResult {
  sentiment: Sentiment;
  summary: string;
}
