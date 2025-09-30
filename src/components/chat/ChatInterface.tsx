"use client";

import { useState, useRef, useEffect } from "react";
import { moderateGroupChatMessage } from "@/ai/flows/moderate-group-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";
import { Send, Loader2, ShieldAlert } from "lucide-react";

const initialMessages: ChatMessage[] = [
  { id: 1, user: "User-246", avatar: "https://picsum.photos/seed/avatar1/40/40", message: "Hey everyone, feeling a bit down today.", isSafe: true },
  { id: 2, user: "User-753", avatar: "https://picsum.photos/seed/avatar2/40/40", message: "You're not alone. We're here for you.", isSafe: true },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const moderationResult = await moderateGroupChatMessage({
        message: input,
        userId: "local-user",
      });

      const newMessage: ChatMessage = {
        id: Date.now(),
        user: "You",
        avatar: "https://picsum.photos/seed/user-avatar/40/40",
        message: input,
        isSafe: moderationResult.isSafe,
        reason: moderationResult.reason,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      if (!moderationResult.isSafe) {
        toast({
          title: "Message Flagged",
          description: `Your message was flagged: ${moderationResult.reason}`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/30">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3",
                msg.user === "You" && "flex-row-reverse"
              )}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={msg.avatar} />
                <AvatarFallback>{msg.user.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "max-w-xs md:max-w-md p-3 rounded-xl",
                  msg.user === "You"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card text-card-foreground rounded-bl-none"
                )}
              >
                <p className="font-semibold text-sm mb-1">{msg.user}</p>
                {msg.isSafe ? (
                    <p className="text-sm">{msg.message}</p>
                ) : (
                    <div className="italic text-destructive-foreground/70 bg-destructive/50 p-2 rounded-md">
                        <p className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Message blocked</p>
                        <p className="text-xs mt-1">Reason: {msg.reason}</p>
                    </div>
                )}
              </div>
            </div>
          ))}
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
