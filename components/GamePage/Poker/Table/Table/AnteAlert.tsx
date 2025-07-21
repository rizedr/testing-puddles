import { useEffect, useState } from 'react';
import { Image, useBreakpointValue } from '@chakra-ui/react';

export const AnteAlert = () => {
    const [visible, setVisible] = useState(true);
    const [fade, setFade] = useState(false);
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    // Use the same top as CommunityCards
    const cardPlacementTop = isPortrait ? '34%' : 'min(28%, 19vmin)';
    // Center horizontally
    const cardPlacementLeft = '50%';
    const anteSize = isPortrait ? '19vmax' : 'min(22vmin, 17vmax)';

    useEffect(() => {
        const fadeTimeout = setTimeout(() => setFade(true), 1500);
        const hideTimeout = setTimeout(() => setVisible(false), 2100);
        return () => {
            clearTimeout(fadeTimeout);
            clearTimeout(hideTimeout);
        };
    }, []);

    if (!visible) return null;

    return (
        <Image
            src="/AnteAlert.webp"
            alt="Ante"
            position="absolute"
            top={cardPlacementTop}
            left={cardPlacementLeft}
            transform="translate(-50%, 0)"
            zIndex={3}
            boxSize={anteSize}
            style={{
                transition: 'opacity 1s',
                opacity: fade ? 0 : 1,
                pointerEvents: 'none',
            }}
        />
    );
};
