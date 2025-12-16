export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text?: string;
  image?: string; // Base64 data URL
  timestamp: number;
}

export type AppView = 'landing' | 'editor';

export interface GenerationConfig {
  prompt: string;
  currentImage?: string; // Base64 string without prefix for API
}