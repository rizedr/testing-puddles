import { useEffect, useState, useRef } from 'react';

import useGameData from '../../../../../../../hooks/useGameData';

const getProgressColor = (value: number) => {
    if (value > 60) return '#4BE132';
    if (value > 30) return '#FF982B';
    return '#FF3945';
};

export const usePlayerProgress = () => {
    const [progress, setProgress] = useState(100);
    const [extraTimeProgress, setExtraTimeProgress] = useState(100);
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
    const { gameSettings, currentDecidingPlayer, targetTime, extraTimeActivated, extraTime } = useGameData();
    const turnTime = gameSettings?.turn_time;
    const animationFrameId = useRef<number>(0);
    const lastUpdateTime = useRef<number>(0);

    useEffect(() => {
        if (!targetTime || !turnTime) {
            return;
        }

        const calculateProgress = (timestamp: number) => {
            if (timestamp - lastUpdateTime.current >= 50) {
                const currentTime = Date.now() / 1000;
                const timeRemaining = Math.max(0, targetTime - currentTime);
                let newProgress: number;
                let newExtraTimeProgress: number;

                if (extraTimeActivated) {
                    // When extra time is activated, calculate progress for extra time bar
                    const regularTimeRemaining = Math.max(0, timeRemaining - extraTime);
                    const extraTimeRemaining = Math.max(0, timeRemaining);

                    // Main progress bar is 0 during extra time
                    newProgress = regularTimeRemaining > 0 ? ((regularTimeRemaining / turnTime) * 100) : 0;

                    // Purple bar animates only during extra time
                    if (timeRemaining <= extraTime) {
                        newExtraTimeProgress = (extraTimeRemaining / extraTime) * 100;
                    } else {
                        newExtraTimeProgress = 100;
                    }
                } else {
                    // Not in extra time: purple bar is always full
                    const progressValue = ((timeRemaining) / turnTime) * 100;
                    newProgress = Math.max(0, Math.min(100, progressValue - 0.5));
                    newExtraTimeProgress = 100;
                }

                if (Math.abs(progress - newProgress) > 0.5) {
                    setProgress(newProgress);
                }
                if (Math.abs(extraTimeProgress - newExtraTimeProgress) > 0.5) {
                    setExtraTimeProgress(newExtraTimeProgress);
                }

                const newRemainingSeconds = Math.floor(timeRemaining);
                if (remainingSeconds !== newRemainingSeconds) {
                    setRemainingSeconds(newRemainingSeconds);
                }

                lastUpdateTime.current = timestamp;
            }
            animationFrameId.current = requestAnimationFrame(calculateProgress);
        };

        lastUpdateTime.current = performance.now();
        animationFrameId.current = requestAnimationFrame(calculateProgress);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [targetTime, turnTime, extraTime, currentDecidingPlayer, extraTimeActivated]);

    const progressColor = getProgressColor(progress);
    const extraTimeProgressColor = '#B165F6'; // Very slightly lighter bright purple color for extra time
    
    return { 
        progressValue: progress, 
        progressColor, 
        remainingSeconds,
        extraTimeProgressValue: extraTimeProgress,
        extraTimeProgressColor,
        extraTimeActivated
    };
};
