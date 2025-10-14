import type { MoodBooster, Medication } from '@/lib/types';
import { Sprout, ConciergeBell, Cookie, Star, Dog, Coffee, PenSquare, Users, MessageSquarePlus, Trash2, Send, Podcast, StretchHorizontal, GlassWater, NotebookPen, Smile, DoorOpen, Leaf } from 'lucide-react';

export const moodBoosters: MoodBooster[] = [
  { text: "Gift a neighbor a small plant", icon: Sprout },
  { text: "Help a neighbor with a chore", icon: ConciergeBell },
  { text: "Bake cookies for a friend", icon: Cookie },
  { text: "Leave a positive review for a local business", icon: Star },
  { text: "Offer to walk a neighbor's dog", icon: Dog },
  { text: "Pay for the coffee of the person behind you", icon: Coffee },
  { text: "Write a thank-you note to a community helper", icon: PenSquare },
  { text: "Volunteer at a local shelter for an hour", icon: Users },
  { text: "Give a genuine compliment to a stranger", icon: MessageSquarePlus },
  { text: "Tidy up a shared space you use", icon: Trash2 },
  { text: "Send a positive text to a friend you haven't spoken to recently", icon: Send },
  { text: "Listen to a new, uplifting podcast episode", icon: Podcast },
  { text: "Take five minutes to stretch your body", icon: StretchHorizontal },
  { text: "Drink a full glass of water", icon: GlassWater },
  { text: "Write down three things you are grateful for", icon: NotebookPen },
  { text: "Smile at the next person you see", icon: Smile },
  { text: "Hold the door open for someone", icon: DoorOpen },
  { text: "Pick up one piece of litter you see outside", icon: Leaf },
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
