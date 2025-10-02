"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import DisclaimerDialog from "./DisclaimerDialog";
import { therapyConversation } from "@/ai/flows/therapy-conversation";

type TranscriptItem = {
  speaker: "user" | "ai";
  text: string;
};

type HistoryItem = {
  role: 'user' | 'model';
  content: { text: string }[];
};

export default function TherapySession() {
  const [isMounted, setIsMounted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const aiAvatar = PlaceHolderImages.find((p) => p.id === "therapy-session-ai");

  useEffect(() => {
    setIsMounted(true);
    audioRef.current = new Audio();
  }, []);

  const handleSpeech = async (text: string) => {
    if (!text) return;
    setTranscript((prev) => [...prev, { speaker: "user", text }]);
    
    const newHistory: HistoryItem[] = [...history, { role: 'user', content: [{ text }] }];
    setHistory(newHistory);
    
    setIsAiSpeaking(true);
    try {
      const result = await therapyConversation({ history: newHistory, message: text });
      playAudio(result.audio);
      setTranscript((prev) => [...prev, { speaker: "ai", text: result.response }]);
      setHistory((prev) => [...prev, { role: 'model', content: [{ text: result.response }] }]);
    } catch (error) {
      console.error("Error with therapy conversation flow:", error);
      const errorMessage = "I'm having a little trouble connecting right now. Please give me a moment.";
      speak(errorMessage);
      setTranscript((prev) => [...prev, { speaker: "ai", text: errorMessage }]);
    } finally {
      setIsAiSpeaking(false);
    }
  };
  
  const playAudio = (audioDataUri: string) => {
    if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play();
        audioRef.current.onended = () => {
            setIsAiSpeaking(false);
        };
    }
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    setIsAiSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsAiSpeaking(false);
    };
    setTranscript((prev) => [...prev, { speaker: "ai", text }]);
    setHistory((prev) => [...prev, { role: 'model', content: [{ text }] }]);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
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

    let finalTranscript = '';
    recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        // We will only handle speech when the user stops talking
    };

    recognitionRef.current.onstart = () => setIsListening(true);
    
    recognitionRef.current.onend = () => {
        setIsListening(false);
        handleSpeech(finalTranscript);
        finalTranscript = '';
    };

    recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
    };
    
    // Auto start listening after disclaimer
    if (!showDisclaimer) {
        speak("Hello, I'm here to listen. How are you feeling today?");
        // Don't auto-toggle listen, let user initiate
    }

    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
      if(audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
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
            isListening ? "bg-red-500 hover:bg-red-600" : "bg-gray-700 hover:bg-gray-600"
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
