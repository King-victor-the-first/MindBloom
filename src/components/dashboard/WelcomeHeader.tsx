import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WelcomeHeader() {
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-foreground">
          Good Morning, Victor
        </h1>
        <p className="text-muted-foreground mt-1">
          Ready to start your day with mindfulness?
        </p>
      </div>
      <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
        {userAvatar && (
            <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />
        )}
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>
    </div>
  );
}
