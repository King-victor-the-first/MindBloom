"use client";

import { useState, useRef, useEffect } from "react";
import { moderateGroupChatMessage } from "@/ai/flows/moderate-group-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Send, Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { collection, query, orderBy, serverTimestamp, doc } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/lib/types";

// The shape of a message document in Firestore
type FirestoreChatMessage = {
    id: string;
    userId: string;
    userName: string;
    avatarUrl?: string;
    message: string;
    createdAt: any; // Firestore Timestamp
    isModerator?: boolean;
};

// The shape of a message after processing for the UI
type DisplayMessage = {
    id: string;
    user: string; // userName, or "You"
    avatar: string;
    message: string;
    isSafe: boolean;
    reason?: string;
    isModerator?: boolean;
};

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [moderationLoading, setModerationLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const firestore = useFirestore();

  // Get user profile to check for moderator status
  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "userProfiles", user.uid);
  }, [firestore, user]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  // Set up the query for the chat messages collection
  const messagesQuery = useMemoFirebase(() => 
    query(collection(firestore, "groupChatMessages"), orderBy("createdAt", "asc"))
  , [firestore]);

  // Subscribe to chat messages
  const { data: messages, isLoading: messagesLoading } = useCollection<FirestoreChatMessage>(messagesQuery);

  const scrollToBottom = () => {
     if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            setTimeout(() => {
                viewport.scrollTop = viewport.scrollHeight;
            }, 0);
        }
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user || !userProfile) return;

    setModerationLoading(true);
    try {
      const moderationResult = await moderateGroupChatMessage({
        message: input,
        userId: user.uid,
      });

      if (!moderationResult.isSafe) {
        toast({
          title: "Message Blocked",
          description: `Your message was blocked: ${moderationResult.reason}`,
          variant: "destructive",
        });
        setInput(""); // Clear input even if blocked
        return;
      }
      
      const userName = userProfile.firstName ? `${userProfile.firstName} ${userProfile.lastName?.[0] || ''}.` : "Anonymous";
      
      const newMessage = {
        userId: user.uid,
        userName: userName,
        avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`,
        message: input,
        createdAt: serverTimestamp(),
        isModerator: userProfile?.isModerator === true,
      };

      const messagesCollectionRef = collection(firestore, "groupChatMessages");
      addDocumentNonBlocking(messagesCollectionRef, newMessage);

      setInput("");
      scrollToBottom();

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setModerationLoading(false);
    }
  };

  const loading = moderationLoading || messagesLoading;

  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messagesLoading && (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          {messages && messages.map((msg) => {
            const isYou = msg.userId === user?.uid;
            return (
                <div
                key={msg.id}
                className={cn(
                    "flex items-start gap-3",
                    isYou && "flex-row-reverse"
                )}
                >
                <Avatar className="w-8 h-8">
                    <AvatarImage src={msg.avatarUrl} />
                    <AvatarFallback>{msg.userName?.substring(0, 2) || 'A'}</AvatarFallback>
                </Avatar>
                <div
                    className={cn(
                    "max-w-xs md:max-w-md p-3 rounded-xl",
                    isYou
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card text-card-foreground rounded-bl-none"
                    )}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">{isYou ? "You" : msg.userName}</p>
                        {msg.isModerator && (
                            <Badge variant="secondary" className="h-5 px-1.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Mod
                            </Badge>
                        )}
                    </div>
                    
                    <p className="text-sm">{msg.message}</p>
                </div>
                </div>
            )
          })}
        </div>
      </ScrollArea>
      <div className="p-4 bg-card border-t">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a supportive message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading} size="icon">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
