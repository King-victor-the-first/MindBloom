"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SafetyPlanDisplay from "./SafetyPlanDisplay";

type CrisisModeDialogProps = {
  isOpen: boolean;
  onClose: (showTriggerModal: boolean) => void;
};

export default function CrisisModeDialog({ isOpen, onClose }: CrisisModeDialogProps) {
  const [showSafetyPlan, setShowSafetyPlan] = useState(false);

  const handleViewPlan = () => {
    setShowSafetyPlan(true);
  };

  const handleClose = (showTriggerModal: boolean) => {
    setShowSafetyPlan(false);
    onClose(showTriggerModal);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose(true)}>
      <DialogContent className="max-w-md">
        {!showSafetyPlan ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-destructive text-xl text-center">
                You are not alone. Let's get support.
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
                It sounds like you're going through a very difficult time.
                Please know that help is available.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button size="lg" onClick={handleViewPlan}>
                View My Safety Plan
              </Button>
              <Button size="lg" variant="outline" onClick={() => handleClose(true)}>
                I am safe for now
              </Button>
            </div>
          </>
        ) : (
           <SafetyPlanDisplay onDone={() => handleClose(true)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
