import type { LucideIcon } from 'lucide-react';

export interface Activity {
  id: number;
  description: string;
  time: string;
}

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  time: string;
}

export interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  message: string;
  isSafe: boolean;
  reason?: string;
}

export interface MoodBooster {
  text: string;
  icon: LucideIcon;
}

export interface ScheduledSession {
  id: string;
  date: string;
  time: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
