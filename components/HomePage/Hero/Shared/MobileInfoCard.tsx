'use client';

import {
    VStack,
    Text,
    Image,
    HStack,
    Stack,
    useBreakpointValue,
} from '@chakra-ui/react';

interface MobileInfoConfig {
    stepImageSrc: string;
    mobileImageSrc: string;
    description: string;
}

const MobileStepCard = ({ gameConfig }: { gameConfig: MobileInfoConfig }) => {
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    return (
        <VStack
            spacing={0}

        >
            <Image
                src={gameConfig.stepImageSrc}
                w={isPortrait ? "7.5vw" : "3.5vw"}
                h={isPortrait ? "7.5vw" : "3.5vw"}
                maxWidth={isPortrait ? "42px" : "52px"}
                maxHeight={isPortrait ? "42px" : "52px"}
                userSelect="none"
                draggable={false}
                // boxShadow="0px 0px 10px 4px purple"
                // transform="translateX(-20%)"
            />

            <Text fontSize="md" transform="translateY(10px)" fontWeight="900" textAlign="center">
                {gameConfig.description}
            </Text>

            <Image
                src={gameConfig.mobileImageSrc}
                w="40vw"
                height="48vw"
                maxHeight="380px"
                objectFit="contain"
                transform="translateY(5%) translateX(2%)"
                alignSelf="center"
                alignItems="center"
                userSelect="none"
                draggable={false}
            />
        </VStack>
    );
};

export const MobileInfoCard = () => {
    const gameConfigs: MobileInfoConfig[] = [
        {
            stepImageSrc: '/mobilestep1.png',
            mobileImageSrc: '/mobile1.png',
            description: "GO TO GINZAGAMING.COM",
        },
        {
            stepImageSrc: '/mobilestep2.png',
            mobileImageSrc: '/mobile2.png',
            description: 'CLICK THE SHARE BUTTON',
        },
        {
            stepImageSrc: '/mobilestep3.png',
            mobileImageSrc: '/mobile3.png',
            description: 'CLICK "ADD TO HOME SCREEN"',
        },
    ];

    // Determine whether to use HStack or VStack based on screen size
    const StackComponent = useBreakpointValue({ base: VStack, md: HStack });

    return (
        <Stack width="100%" alignItems="center" spacing="16px">
            <Text fontSize={{ base: "1.75rem", xl: "2rem" }} fontWeight="900" textAlign="center">
                ENJOY POKER ON <Text as="span" color="purple.300">MOBILE</Text>
            </Text>
            <Text 
                fontSize={{ base: "0.85rem", xl: "1.2rem" }}
                fontWeight="600"
                color="brand.white80"
                alignContent="center"
                whiteSpace="normal"
                overflowWrap="break-word"
                maxWidth={{ base: "400px", lg: "520px", xl: "720px" }}
                mx="auto"
            >
                Enjoy mobile focused poker gameplay via our Progressive Web App (PWA) that you can install directly from the browser.
            </Text>
            <StackComponent mt="32px" spacing="42px" w="100%">
                {gameConfigs.map((config, index) => (
                    <MobileStepCard key={index} gameConfig={config} />
                ))}
            </StackComponent>
        </Stack>
    );
};