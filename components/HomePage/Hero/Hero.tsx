import { VStack, Box, Stack, Text, Link } from '@chakra-ui/react';
import { GameMainCard } from './Shared/GameMainCard';

import { MobileInfoCard } from './Shared/MobileInfoCard';
import { FAQCard } from './Shared/FAQCard';
import { FeatureInfoCard } from './Shared/FeatureInfoCard';

import { PublicGamesCard } from './Shared/PublicGamesCard';
import { NewsletterCard } from './Shared/NewsletterCard';

export const Hero: React.FC = () => {
    return (
        <VStack
            // h="calc(100vh - 4.125rem)"
            w="100%"
            p={{ base: '16px', lg: '48px' }}
            align="center"
            position="relative"
            gap="16px"
            mx="auto"
            justify="flex-start"
            alignItems="center"
        >
            <Stack
                direction={{ base: 'column', lg: 'row' }}
                spacing="24px"
                w="100%"
                maxW="1600px"
                align="flex-start"
                alignItems="stretch"
            >
                <Box w={{ base: '100%', lg: '60%' }} h="fit-content" mb="9vw">
                    <GameMainCard />
                </Box>
                <Box
                    w={{ base: '100%', lg: '40%' }}
                    // flex="1"
                    position="relative"
                    // border="1px solid rgba(255,255,255,0.25)"
                    borderRadius="16px"
                    // background="linear-gradient(160.96deg, #1C112A -90.9%, rgba(210, 174, 245, 0.1) -100%, #0C0A16 52%),rgb(12, 14, 24)"
                    mb="9vw"
                >
                    {/* <PublicGamesCard /> */}
                    <NewsletterCard/>
                </Box>
            </Stack>
            <Box
                w="100%"
                maxW="1200px"
                borderRadius="16px"
                position="relative"
                mb="9vw"
            >
                <FeatureInfoCard />
            </Box>
            <Box
                w="100%"
                maxW="1200px"
                borderRadius="16px"
                position="relative"
                mb="9vw"
            >
                <MobileInfoCard />
            </Box>
            <Box
                w="100%"
                maxW="1200px"
                borderRadius="16px"
                position="relative"
                mb="6vw"
            >
                <FAQCard />
            </Box>
            
            <Box
                w="100%"
                textAlign="center"
            >
                <Text color="whiteAlpha.700" fontSize="sm" lineHeight="1.6">
                    Ginzagaming is owned and operated by Collective Catsino of the
                </Text>
                <Text color="whiteAlpha.700" fontSize="sm" lineHeight="1.6">
                    People Sociedad de Responsabilidad Limitada (CCPSRL), a limited
                </Text>
                <Text color="whiteAlpha.700" fontSize="sm" lineHeight="1.6">
                    liability company incorporated in the Republic of Costa Rica.
                </Text>
            </Box>
            <Box
                w="100%"
                textAlign="center"
                mb="6vw"
                // mb={{ base: '48vw', lg: '12vw' }}
            >
                <Text color="whiteAlpha.700" fontSize="sm" textAlign="center">
                    Copyright 2025 CCPSRL. All rights here totally reserved
                </Text>
                <Stack direction="row" spacing="16px" justify="center" mt="8px">
                    <Link
                        href="https://docs.ginzagaming.com/privacy-policy"
                        isExternal
                        color="whiteAlpha.800"
                        fontWeight="600"
                        fontSize="md"
                        _hover={{
                            textDecoration: "underline",
                            color: "whiteAlpha.800"
                        }}
                        transition="all 0.2s"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="https://docs.ginzagaming.com/terms-of-service-1"
                        isExternal
                        color="whiteAlpha.800"
                        fontWeight="600"
                        fontSize="md"
                        _hover={{
                            textDecoration: "underline",
                            color: "whiteAlpha.800"
                        }}
                        transition="all 0.2s"
                    >
                        Terms and Conditions
                    </Link>
                </Stack>
            </Box>
        </VStack>
    );
};
