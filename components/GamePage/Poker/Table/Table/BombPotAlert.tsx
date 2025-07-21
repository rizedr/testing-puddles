import { useEffect, useState } from 'react';
import { Image, useBreakpointValue } from '@chakra-ui/react';

export const BombPotAlert = () => {
    const [visible, setVisible] = useState(true);
    const [fade, setFade] = useState(false);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    // Use the same top as CommunityCards
    const cardPlacementTop = isPortrait ? '34%' : 'min(28%, 19vmin)';
    // Center horizontally
    const cardPlacementLeft = '50%';
    const bombPotSize = isPortrait ? '19vmax' : 'min(22vmin, 17vmax)';

    useEffect(() => {
        // Start fade after 1.5s
        const fadeTimeout = setTimeout(() => setFade(true), 1300);
        // Hide after 2.5s
        const hideTimeout = setTimeout(() => setVisible(false), 2200);
        return () => {
            clearTimeout(fadeTimeout);
            clearTimeout(hideTimeout);
        };
    }, []);

    if (!visible) return null;

    return (
        <Image
            src="/BombPotAlert.webp"
            alt="Bomb Pot"
            position="absolute"
            top={cardPlacementTop}
            left={cardPlacementLeft}
            transform="translate(-50%, 0)"
            zIndex={3}
            boxSize={bombPotSize}
            style={{
                transition: 'opacity 1s',
                opacity: fade ? 0 : 1,
                pointerEvents: 'none',
            }}
            userSelect="none"
            draggable={false}
        />
    );
};
