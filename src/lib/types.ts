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
  id: string;
  userId: string;
  userName: string;
  avatarUrl: string;
  message: string;
  createdAt: any;
  isModerator?: boolean;
  isDeleted?: boolean;
  mediaUrl?: string;
  mediaType?: string;
  replyTo?: {
    messageId: string;
    messageOwner: string;
    messageSnippet: string;
  };
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
  isModerator?: boolean;
}

export interface MoodEntry {
    id: string;
    mood: "Awful" | "Bad" | "Okay" | "Good" | "Great";
    value: number;
    createdAt: any; // Firestore Timestamp
    trigger?: string;
    triggerNote?: string;
}

export interface GratitudeEntry {
  id: string;
  date: string;
  entry: string;
  createdAt: any;
}

export interface SafetyPlanContact {
    id: string;
    name: string;
    phone: string;
}

export interface SafetyPlanResource {
    id: string;
    name: string;
    phone: string;
}

export interface SafetyPlan {
    trustedContacts: SafetyPlanContact[];
    emergencyResources: SafetyPlanResource[];
    copingStrategies: string;
}
