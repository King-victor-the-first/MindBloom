
"use client";

import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { SafetyPlan } from "@/lib/types";
import { Loader2, Phone, ShieldCheck, User, LifeBuoy } from "lucide-react";
import { Button } from "../ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

type SafetyPlanDisplayProps = {
    onDone: () => void;
}

export default function SafetyPlanDisplay({ onDone }: SafetyPlanDisplayProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const safetyPlanRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `userProfiles/${user.uid}/safetyPlan/userPlan`);
  }, [user, firestore]);

  const { data: safetyPlan, isLoading } = useDoc<SafetyPlan>(safetyPlanRef);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center">Your Safety Plan</DialogTitle>
        <DialogDescription className="text-center">
          Here are your contacts and strategies to help you through this.
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto p-1 space-y-4">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5"/>
                    Trusted Contacts
                </CardTitle>
            </CardHeader>
            <CardContent>
                {safetyPlan?.trustedContacts?.length ? (
                    <ul className="space-y-3">
                        {safetyPlan.trustedContacts.map(contact => (
                            <li key={contact.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{contact.name}</p>
                                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <a href={`tel:${contact.phone}`}>
                                        <Phone className="mr-2 h-4 w-4"/>
                                        Call
                                    </a>
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-muted-foreground">No trusted contacts added.</p>}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <LifeBuoy className="w-5 h-5"/>
                    Emergency Resources
                </CardTitle>
            </CardHeader>
            <CardContent>
                {safetyPlan?.emergencyResources?.length ? (
                     <ul className="space-y-3">
                        {safetyPlan.emergencyResources.map(resource => (
                            <li key={resource.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{resource.name}</p>
                                    <p className="text-sm text-muted-foreground">{resource.phone}</p>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <a href={`tel:${resource.phone}`}>
                                        <Phone className="mr-2 h-4 w-4"/>
                                        Call
                                    </a>
                                </Button>
                            </li>
                        ))}
                    </ul>
                ): <p className="text-sm text-muted-foreground">No emergency resources added.</p>}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldCheck className="w-5 h-5"/>
                    My Coping Strategies
                </CardTitle>
            </CardHeader>
            <CardContent>
                {safetyPlan?.copingStrategies ? (
                    <p className="text-sm whitespace-pre-wrap">{safetyPlan.copingStrategies}</p>
                ) : <p className="text-sm text-muted-foreground">No coping strategies added.</p>}
            </CardContent>
        </Card>
      </div>
      <DialogFooter>
        <Button onClick={onDone} className="w-full">
          I'm done viewing my plan
        </Button>
      </DialogFooter>
    </>
  );
}
