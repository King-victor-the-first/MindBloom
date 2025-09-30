"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import DisclaimerDialog from "./DisclaimerDialog";

// Mock AI responses
const aiResponses = [
  "That's a very interesting point. Could you tell me more about how that felt?",
  "I understand. It sounds like that was a challenging situation for you.",
  "Thank you for sharing that with me. What was going through your mind at that moment?",
  "Let's explore that a bit further. How does that connect to what we discussed earlier?",
  "I hear you. It's completely valid to feel that way.",
  "What do you think you can learn from this experience?",
];

type TranscriptItem = {
  speaker: "user" | "ai";
  text: string;
};

export default function TherapySession() {
  const [isMounted, setIsMounted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();

  const aiAvatar = PlaceHolderImages.find((p) => p.id === "therapy-session-ai");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSpeech = (text: string) => {
    setTranscript((prev) => [...prev, { speaker: "user", text }]);
    // Mock AI response
    setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      speak(response);
    }, 1000);
  };
  
  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    setIsAiSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsAiSpeaking(false);
    };
    setTranscript((prev) => [...prev, { speaker: "ai", text }]);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  useEffect(() => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
      console.log("Speech recognition not supported");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const speechToText = event.results[event.results.length - 1][0].transcript;
      handleSpeech(speechToText);
    };

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    
    // Auto start listening after disclaimer
    if (!showDisclaimer) {
        speak("Hello, I'm here to listen. How are you feeling today?");
        toggleListen();
    }

    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDisclaimer]);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (showDisclaimer) {
    return <DisclaimerDialog onAgree={() => setShowDisclaimer(false)} />;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900 text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
        <div className={cn("absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30", isAiSpeaking && 'animate-pulse')}/>
        <div className={cn("w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 transition-all duration-500", isAiSpeaking ? 'border-primary shadow-[0_0_30px] shadow-primary/50' : 'border-gray-600')}>
            {aiAvatar && <Image src={aiAvatar.imageUrl} alt="AI Therapist" width={300} height={300} data-ai-hint={aiAvatar.imageHint} />}
        </div>
        <h2 className="text-2xl font-bold mt-6 font-headline">AI Therapist</h2>
        <p className="text-gray-300">Session in progress...</p>
        <div className="mt-8 text-lg text-gray-200 h-20 flex items-center justify-center">
            {isAiSpeaking && <p>AI is speaking...</p>}
            {isListening && !isAiSpeaking && <p>Listening...</p>}
            {!isListening && !isAiSpeaking && <p>Mic is off. Tap to speak.</p>}
        </div>

        <div className="absolute bottom-32 left-4 right-4 text-center max-h-48 overflow-y-auto">
            {transcript.length > 0 && <p className={cn(
                "text-xl transition-opacity duration-300",
                transcript[transcript.length-1].speaker === 'user' ? 'text-white' : 'text-primary/90'
            )}>"{transcript[transcript.length-1].text}"</p>}
        </div>

      </div>
      <div className="bg-black/50 p-6 flex justify-center items-center gap-8">
        <Button onClick={toggleListen} size="lg" className={cn(
            "rounded-full w-20 h-20 transition-colors",
            isListening ? "bg-white text-black hover:bg-gray-200" : "bg-gray-700 hover:bg-gray-600"
        )}>
            {isListening ? <MicOff className="h-8 w-8"/> : <Mic className="h-8 w-8"/>}
        </Button>
        <Button onClick={() => router.push('/dashboard')} size="lg" variant="destructive" className="rounded-full w-20 h-20">
            <PhoneOff className="h-8 w-8"/>
        </Button>
      </div>
    </div>
  );
}
