
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  const [voice, setVoice] = useState('Algenib');

  const aiAvatar = PlaceHolderImages.find((p) => p.id === "therapy-session-ai");

  useEffect(() => {
    setIsMounted(true);
    audioRef.current = new Audio();
    const savedVoice = localStorage.getItem('aiVoice') || 'Algenib';
    setVoice(savedVoice);
  }, []);

  const playAudio = useCallback((audioDataUri: string) => {
    if (audioRef.current) {
        setIsAiSpeaking(true);
        audioRef.current.src = audioDataUri;
        audioRef.current.play();
        audioRef.current.onended = () => {
            setIsAiSpeaking(false);
            // After AI finishes speaking, start listening for the user again.
            recognitionRef.current?.start();
        };
        audioRef.current.onerror = () => {
            console.error("Error playing audio.");
            setIsAiSpeaking(false);
        };
    }
  }, []);

  const handleSpeech = useCallback(async (text: string) => {
    if (!text || isAiSpeaking) return;

    const userMessage: TranscriptItem = { speaker: "user", text };
    setTranscript((prev) => [...prev, userMessage]);

    const newHistory: HistoryItem[] = [...history, { role: 'user', content: [{ text }] }];
    setHistory(newHistory);
    
    try {
      const result = await therapyConversation({ history: newHistory, message: text, voiceName: voice });
      const aiMessage: TranscriptItem = { speaker: "ai", text: result.response };
      
      setTranscript((prev) => [...prev, aiMessage]);
      setHistory((prev) => [...prev, { role: 'model', content: [{ text: result.response }] }]);
      playAudio(result.audio);

    } catch (error) {
      console.error("Error with therapy conversation flow:", error);
      const errorMessage = "I'm having a little trouble connecting right now. Please give me a moment.";
      // Using speak fallback if AI TTS fails
      if (typeof window !== "undefined" && window.speechSynthesis) {
        setIsAiSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(errorMessage);
        utterance.onend = () => {
            setIsAiSpeaking(false);
            recognitionRef.current?.start();
        };
        utterance.onerror = () => setIsAiSpeaking(false);
        setTranscript((prev) => [...prev, { speaker: 'ai', text: errorMessage }]);
        setHistory((prev) => [...prev, { role: 'model', content: [{text: errorMessage}] }]);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsAiSpeaking(false);
      }
    }
  }, [history, voice, playAudio]);

   // Effect for initial greeting
  useEffect(() => {
    if (!showDisclaimer) {
        // A small delay to ensure the user is ready.
        const timer = setTimeout(() => {
            handleSpeech("Hello, I'm Bloom. I'm here to listen. How are you feeling today?");
        }, 500);
        return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDisclaimer]);


  // Effect for setting up speech recognition
  useEffect(() => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
      console.log("Speech recognition not supported");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = false; // Process speech after a pause.
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access was denied. Please allow microphone access in your browser settings.');
        }
    };
    
    recognition.onresult = (event) => {
        const finalTranscript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        if (finalTranscript.trim()) {
            handleSpeech(finalTranscript.trim());
        }
    };

    return () => {
      recognition?.abort();
      window.speechSynthesis?.cancel();
      if(audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [handleSpeech]);

  const toggleListen = () => {
    if (isAiSpeaking) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };


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
            {aiAvatar && (
                <video 
                    src={aiAvatar.imageUrl} 
                    data-ai-hint={aiAvatar.imageHint} 
                    className="w-full h-full object-cover" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                />
            )}
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
        <Button 
            onClick={toggleListen} 
            size="lg" 
            className={cn(
                "rounded-full w-20 h-20 transition-all duration-300 shadow-lg",
                 isListening 
                    ? "bg-red-500/70 animate-pulse" 
                    : "bg-primary",
                isAiSpeaking && "bg-gray-700 opacity-50 cursor-not-allowed"
            )}
            disabled={isAiSpeaking}
        >
            {isListening ? <MicOff className="h-8 w-8"/> : <Mic className="h-8 w-8"/>}
        </Button>
        <Button onClick={() => router.push('/dashboard')} size="lg" variant="destructive" className="rounded-full w-20 h-20">
            <PhoneOff className="h-8 w-8"/>
        </Button>
      </div>
    </div>
  );
}


