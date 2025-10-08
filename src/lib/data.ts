import type { MoodBooster, Medication } from '@/lib/types';
import { Gift, HelpingHand, Cookie, Star, Dog, Coffee, Heart, Users } from 'lucide-react';

export const moodBoosters: MoodBooster[] = [
  { text: "Gift a neighbor a small plant", icon: Gift },
  { text: "Help a neighbor with a chore", icon: HelpingHand },
  { text: "Bake cookies for a friend", icon: Cookie },
  { text: "Leave a positive review for a local business", icon: Star },
  { text: "Offer to walk a neighbor's dog", icon: Dog },
  { text: "Pay for the coffee of the person behind you", icon: Coffee },
  { text: "Write a thank-you note to a community helper", icon: Heart },
  { text: "Volunteer at a local shelter for an hour", icon: Users },
];

export const medications: Medication[] = [
    {
        id: 1,
        name: "Serenex",
        dosage: "10mg",
        time: "08:00 AM",
    },
    {
        id: 2,
        name: "Calmify",
        dosage: "5mg",
        time: "09:00 PM",
    }
]
