
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, PhoneOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import DisclaimerDialog from "./DisclaimerDialog";
import { therapyConversation } from "@/ai/flows/therapy-conversation";
import type { MessageData } from 'genkit/ai';

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
  const [history, setHistory] = useState<MessageData[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const [voice, setVoice] = useState('Algenib');

  const aiAvatar = PlaceHolderImages.find((p) => p.id === "therapy-session-ai");

  // --- Client-side Initialization ---
  useEffect(() => {
    setIsMounted(true);
    audioRef.current = new Audio();
    const savedVoice = localStorage.getItem('aiVoice') || 'Algenib';
    setVoice(savedVoice);
  }, []);

  const playAudio = useCallback((audioDataUri: string, onEnd: () => void) => {
    if (audioRef.current) {
        setIsAiSpeaking(true);
        audioRef.current.src = audioDataUri;
        
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Error playing audio:", error);
                // If play() is interrupted or fails, ensure we clean up state.
                setIsAiSpeaking(false);
                onEnd();
            });
        }

        audioRef.current.onended = () => {
            setIsAiSpeaking(false);
            onEnd(); // Callback to be executed after audio finishes
        };
        
        audioRef.current.onerror = (e) => {
            console.error("Audio element error:", e);
            setIsAiSpeaking(false);
            onEnd(); // Also call onEnd on error to avoid getting stuck
        };
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && !isAiSpeaking) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // This can happen if it's already starting, which is fine.
      }
    }
  }, [isListening, isAiSpeaking]);


  const handleSpeech = useCallback(async (text: string, isGreeting = false) => {
    if (!text || isAiSpeaking) return;

    const userMessageText = isGreeting ? " " : text;
    const userMessage: TranscriptItem = { speaker: "user", text: userMessageText };
    if (!isGreeting) {
       setTranscript((prev) => [...prev, userMessage]);
    }

    const currentHistory: MessageData[] = isGreeting 
        ? history 
        : [...history, { role: 'user', content: [{ text }] }];
    
    setHistory(currentHistory);
    
    try {
      const result = await therapyConversation({ history: currentHistory, message: text, voiceName: voice });
      const aiMessage: TranscriptItem = { speaker: "ai", text: result.response };
      
      setTranscript((prev) => [...prev, aiMessage]);
      setHistory((prev) => [...prev, { role: 'model', content: [{ text: result.response }] }]);
      
      if (result.audio) {
        playAudio(result.audio, () => {
            // After audio finishes, start listening again.
            startListening();
        });
      } else {
        // If there's no audio (e.g., TTS failed), just start listening again.
        startListening();
      }

    } catch (error) {
      console.error("Error with therapy conversation flow:", error);
      const errorMessage = "I'm having a little trouble connecting right now. Please give me a moment.";
      const aiMessage: TranscriptItem = { speaker: "ai", text: errorMessage };
      setTranscript((prev) => [...prev, aiMessage]);
      setHistory((prev) => [...prev, { role: 'model', content: [{text: errorMessage}] }]);
      startListening(); // Also start listening again on error.
    }
  }, [history, voice, playAudio, isAiSpeaking, startListening]);


  // --- Initial Greeting ---
  useEffect(() => {
    // We want this to run *only* when the disclaimer is dismissed for the first time.
    if (!showDisclaimer && history.length === 0) {
      const initialGreeting = "Hello, I'm Bloom. I'm here to listen. How are you feeling today?";
      // We pass the initial prompt to handleSpeech but mark it as a greeting
      handleSpeech(initialGreeting, true);
    }
  }, [showDisclaimer, history.length, handleSpeech]);


  // --- Speech Recognition Setup ---
  useEffect(() => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
      console.log("Speech recognition not supported");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => {
      setIsListening(false);
      // Automatically restart listening if the AI is not speaking.
      // This handles cases where recognition stops due to silence.
      if (!isAiSpeaking) {
        startListening();
      }
    };
    
    recognition.onerror = (event) => {
        // The 'no-speech' and 'aborted' errors are common and benign.
        // We can just ignore them and let onend handle the restart.
        if (event.error === 'no-speech' || event.error === 'aborted') {
            return;
        }
        
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
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if(audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [handleSpeech, isAiSpeaking, startListening]);

  const toggleListen = () => {
    if (isAiSpeaking) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      startListening();
    }
  };

  const handleDisclaimerAgree = () => {
      setShowDisclaimer(false);
  }


  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (showDisclaimer) {
    return <DisclaimerDialog onAgree={handleDisclaimerAgree} />;
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
            {transcript.length > 0 && transcript[transcript.length-1].speaker !== 'user' && <p className={cn(
                "text-xl transition-opacity duration-300",
                "text-primary/90"
            )}>"{transcript[transcript.length-1].text}"</p>}
             {transcript.length > 0 && transcript[transcript.length-1].speaker === 'user' && transcript[transcript.length-1].text.trim() && <p className={cn(
                "text-xl transition-opacity duration-300",
                "text-white"
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
                    ? "bg-primary/90 animate-pulse" 
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
