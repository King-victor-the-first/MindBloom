'use client'

import { cn } from "@/lib/utils";

const SiriWave = ({ isActive }: { isActive: boolean }) => {
    return (
        <div className={cn("flex justify-center items-center space-x-0.5 h-6 w-6", isActive && 'text-primary')}>
            <span className={cn("w-1 h-1 bg-current rounded-full animate-siri-1", isActive && 'animation-delay-0')}></span>
            <span className={cn("w-1 h-2 bg-current rounded-full animate-siri-2", isActive && 'animation-delay-0')}></span>
            <span className={cn("w-1 h-3 bg-current rounded-full animate-siri-3", isActive && 'animation-delay-0')}></span>
            <span className={cn("w-1 h-4 bg-current rounded-full animate-siri-1", isActive && 'animation-delay-0')}></span>
            <span className={cn("w-1 h-3 bg-current rounded-full animate-siri-2", isActive && 'animation-delay-0')}></span>
            <span className={cn("w-1 h-2 bg-current rounded-full animate-siri-3", isActive && 'animation-delay-0')}></span>
            <span className={cn("w-1 h-1 bg-current rounded-full animate-siri-1", isActive && 'animation-delay-0')}></span>
        </div>
    );
};

export default SiriWave;
