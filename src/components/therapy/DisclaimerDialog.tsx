import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ShieldExclamation } from "lucide-react"

type DisclaimerDialogProps = {
    onAgree: () => void;
}

export default function DisclaimerDialog({ onAgree }: DisclaimerDialogProps) {
    return (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <ShieldExclamation className="w-6 h-6 text-primary" />
                        Important Disclaimer
                    </AlertDialogTitle>
                    <AlertDialogDescription className="pt-4 space-y-3 text-left">
                        <p>
                            MindBloom offers AI-powered conversations for wellness support and is not a substitute for professional medical advice, diagnosis, or treatment.
                        </p>
                        <p>
                            This is an MVP and the AI may produce inaccurate or unintended information. It is not intended for use in crisis situations.
                        </p>
                        <p>
                            If you are in a crisis, please contact a local emergency service immediately.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onAgree}>
                        I Understand and Agree
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
