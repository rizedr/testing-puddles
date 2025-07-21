import { Image, Box, useBreakpointValue } from '@chakra-ui/react';

export const TableContents = () => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    return (
        <Box position="absolute" w="100%" h={isPortrait ? '100%' : '100%'}>
            <Box w="100%" h="100%">
                <Image
                    src={
                        isPortrait
                            ? '/TablePortraitGreen0.webp'
                            : '/TableLandscapeGreen1.webp'
                    }
                    // boxSizing="border-box"
                    transition="all 1s ease"
                    // objectFit={isPortrait ? "cover" : "contain"}
                    position="absolute"
                    objectFit="contain"
                    zIndex={1}
                    w="100%"
                    h="100%"
                    userSelect="none"
                    draggable={false}
                />
            </Box>
            <Image
                src="/GinzaLogoWhite2.png"
                alt="Table Logo"
                position="absolute"
                top={isPortrait ? '43%' : '46.5%'}
                left="49.5%"
                transform="translate(-50%, -50%) perspective(500px) rotateX(15deg)"
                width={isPortrait ? '45%' : 'min(34vmin, 28vw)'}
                height={isPortrait ? undefined : 'min(12.5vmin, 10.5vw)'}
                opacity={0.25}
                zIndex={2}
                userSelect="none"
                draggable={false}
            />
            <Image
                src="/RNGCertifiedByGALogo.png"
                alt="RNG Certified Logo"
                position="absolute"
                top={isPortrait ? '49.5%' : '52%'}
                left="50.5%"
                transform="translate(-50%, -50%) perspective(500px) rotateX(20deg)"
                transformOrigin="bottom"
                width={isPortrait ? '32.5%' : 'min(20vmin, 16vw)'}
                height={isPortrait ? undefined : 'min(3vmin, 2.25vw)'}
                opacity={0.3}
                zIndex={2}
                userSelect="none"
                draggable={false}
            />
        </Box>
    );
};

export default TableContents;
