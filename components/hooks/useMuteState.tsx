import { useState, useEffect } from 'react';

export const useMuteState = () => {
    const [isMuted, setIsMuted] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem('isMuted') 
                ? window.localStorage.getItem('isMuted') === 'true' 
                : false;
        }
        return true;
    });
    
    const toggleMute = () => {
        setIsMuted((prevIsMuted: boolean) => {
            const newMuteState = !prevIsMuted;
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('isMuted', JSON.stringify(newMuteState));
            }
            return newMuteState;
        });
    };

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'isMuted') {
                const savedMuteState = window.localStorage.getItem('isMuted');
                const parsedState = savedMuteState ? JSON.parse(savedMuteState) : false;
                setIsMuted(parsedState);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Ensure isMuted and localStorage are in sync
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMuteState = window.localStorage.getItem('isMuted');
            const parsedState = savedMuteState ? JSON.parse(savedMuteState) : false;
            if (parsedState !== isMuted) {
                window.localStorage.setItem('isMuted', JSON.stringify(isMuted));
            }
        }
    }, [isMuted]);

    return { isMuted, toggleMute };
};