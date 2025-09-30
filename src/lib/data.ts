import type { MoodBooster, Medication } from '@/lib/types';

export const moodBoosters: MoodBooster[] = [
  { text: "Gift a neighbor a small plant" },
  { text: "Help a neighbor mow their lawn" },
  { text: "Bake cookies for a friend" },
  { text: "Leave a positive review for a local business" },
  { text: "Offer to walk a neighbor's dog" },
  { text: "Pay for the coffee of the person behind you" },
  { text: "Write a thank-you note to a community helper" },
  { text: "Volunteer at a local shelter for an hour" },
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
