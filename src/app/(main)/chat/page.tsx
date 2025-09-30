import ChatInterface from "@/components/chat/ChatInterface";
import { ShieldCheck } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
       <div className="p-4 border-b">
        <h1 className="text-2xl font-headline font-bold text-center">Support Circle</h1>
        <p className="text-sm text-muted-foreground text-center mt-1 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Anonymous & Moderated Group Chat
        </p>
       </div>
      <ChatInterface />
    </div>
  );
}
