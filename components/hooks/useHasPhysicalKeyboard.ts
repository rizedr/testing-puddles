import { useEffect, useState } from 'react';

export const useHasPhysicalKeyboard = () => {
    const [hasPhysicalKeyboard, setHasPhysicalKeyboard] = useState(false);

    if (typeof window === 'undefined') return false;

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent,
            );
        const isTouchDevice =
            'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const hasPhysicalKeyboard = !isMobile && !isTouchDevice;
        setHasPhysicalKeyboard(hasPhysicalKeyboard);
    }, [window, navigator.userAgent, navigator.maxTouchPoints]);

    return hasPhysicalKeyboard;
};

export default useHasPhysicalKeyboard;
