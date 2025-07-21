'use client';

import {
    VStack,
    Text,
    Image,
    HStack,
    Stack,
    useBreakpointValue,
    Box,
} from '@chakra-ui/react';

interface FeatureInfoConfig {
    stepImageSrc: string;
    title: string;
    description: string;
}

const FeatureCard = ({ gameConfig }: { gameConfig: FeatureInfoConfig }) => {
    return (
        <VStack
            spacing={4}
            minW={{ base: '160px', xl: '240px' }}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
        >
            <Image
                src={gameConfig.stepImageSrc}
                w={{ base: '12.5vw', xl: '8.5vw' }}
                h={{ base: '12.5vw', xl: '8.5vw' }}
                maxWidth="160px"
                maxHeight="160px"
                filter="drop-shadow(-20px 0px 15px rgba(122, 129, 255, 0.35)) drop-shadow(20px 0px 15px rgba(148, 55, 255, 0.35))"
                userSelect="none"
                draggable={false}
            />

            <Text
                fontSize={{ base: '1.05rem', xl: '1.35rem' }}
                fontWeight="900"
                textAlign="center"
            >
                {gameConfig.title}
            </Text>

            <Box width="100%" textAlign="center">
                <Text
                    fontSize={{ base: '0.9rem', xl: '1.15rem' }}
                    fontWeight="500"
                    color="brand.white90"
                    alignContent="center"
                    whiteSpace="normal"
                    overflowWrap="break-word"
                    maxWidth={{ base: '180px', xl: '260px' }}
                    mx="auto"
                >
                    {gameConfig.description}
                </Text>
            </Box>
        </VStack>
    );
};

export const FeatureInfoCard = () => {
    const isPortrait = useBreakpointValue({ base: true, lg: false });
    const gameConfigs: FeatureInfoConfig[] = [
        {
            stepImageSrc: '/USDCPoker.png',
            title: 'USDC POKER',
            description:
                'Play poker using the most popular stablecoins on Ethereum, Base, and Solana.',
        },
        {
            stepImageSrc: '/ProvablyFairHands.png',
            title: 'PROVABLY FAIR HANDS',
            description:
                'Every poker hand comes verified with deck encryption to protect all players.',
        },
        {
            stepImageSrc: '/InstantWithdrawals.png',
            title: 'INSTANT WITHDRAWALS',
            description:
                'Cash out settles funds at the end of current hand. Platform withdrawals are instant.',
        },
        {
            stepImageSrc: '/RAKE.webp',
            title: 'DEMOCRATIZED RAKE',
            description:
                'A portion of the platform fees collected are redistributed back  for inviting their friends.',
        },
        {
            stepImageSrc: '/MultichainSupport.png',
            title: 'MULTICHAIN SUPPORT',
            description:
                'Enjoy poker and other games using stablecoins on Ethereum, Base, Solana, and more.',
        },
        {
            stepImageSrc: '/ONE.webp',
            title: 'COMMUNITY FIRST',
            description:
                'We are a community-driven platform, prioritizing customer satisfaction over profits.',
        },
    ];

    const rows = isPortrait
        ? [
              gameConfigs.slice(0, 2),
              gameConfigs.slice(2, 4),
              gameConfigs.slice(4, 6),
          ]
        : [gameConfigs.slice(0, 3), gameConfigs.slice(3, 6)];

    return (
        <Stack width="100%" alignItems="center" spacing="42px">
            <Text
                fontSize={{ base: '1.75rem', xl: '2rem' }}
                fontWeight="900"
                color="brand.textWhite"
                textAlign="center"
            >
                <Text as="span" color="purple.300">
                    UNIQUE
                </Text>{' '}
                POKER EXPERIENCE
            </Text>
            <VStack
                spacing="52px"
                w="100%"
                alignItems="center"
                justifyContent="center"
            >
                {rows.map((row, rowIndex) => (
                    <HStack
                        key={rowIndex}
                        spacing={{ base: '12px', md: '36px', xl: '100px' }}
                        w="100%"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {row.map((config, index) => (
                            <FeatureCard key={index} gameConfig={config} />
                        ))}
                    </HStack>
                ))}
            </VStack>
        </Stack>
    );
};
