import { PortraitControls } from './Controls/Portrait/PortraitControls';
import { Box, Flex, VStack, Text, Button, Spacer } from '@chakra-ui/react';
import { SlideUpDrawer } from './Controls/Portrait/SlideUpDrawer';
import { Seats } from './Table/Seats/Seats';
import { ApprovePlayerNotification } from '../../Notifications/ApprovePlayerNotification';
import PokerTable from './Table/PokerTable';
import { useGameData } from '../../hooks/useGameData';
import { LedgerTable } from '../../Modals/LedgerModal/LedgerTable';
import Link from 'next/link';
import { RunItTwiceVoteNotification } from '../../Notifications/RunItTwiceNotification';

export const PortraitLayout = () => {
    const { archived } = useGameData();

    if (archived) {
        return (
            <VStack
                h="100%"
                w="100%"
                flexDirection="column"
                position="absolute"
            >
                <VStack
                    w="100%"
                    h="100%"
                    flex={1}
                    justifyContent="center"
                    spacing={8}
                >
                    <Text size="lg">This game has been archived due to inactivity</Text>
                    <Box
                        maxH="80%"
                        overflowY="auto"
                        border="1px solid"
                        borderColor="brand.gray10"
                        borderRadius="md"
                        p={4}
                    >
                        <LedgerTable showStack={false} />
                    </Box>
                    <Box mx="auto" w="fit-content">
                        <Button
                            mt={4}
                            as={Link}
                            href="/"
                            variant="walletButton"
                        >
                            Return Home
                        </Button>
                    </Box>
                </VStack>
                <Flex
                    w="100%"
                    position="absolute"
                    alignItems="center"
                    bottom="0"
                    flexDirection="column"
                >
                    <SlideUpDrawer />
                </Flex>
            </VStack>
        );
    }

    return (
        <VStack
            h="100%"
            w="min(100dvw, 50dvh)"
            gap={0}
            pt="4.5%"
            flexDirection="column"
            aspectRatio="9/19"
            bg="#0F1218"
            position="relative"
        >
            <Box position="fixed" left="50" w="100%" zIndex={100}>
                <ApprovePlayerNotification />
                <RunItTwiceVoteNotification />
            </Box>

            <Flex flex={1} w="100%">
                <Box position="relative" mt="-13.75vh" h="100%" w="100%">
                    <PokerTable />
                </Box>
                <Box h="69%" w="100%" position="absolute" zIndex={2}>
                    <Seats />
                </Box>
            </Flex>

            <Flex
                w="100%"
                h="21.5vh"
                position="absolute"
                alignItems="center"
                bottom="0"
                flexDirection="column"
            >
                <Box flex={1}>
                    <PortraitControls />
                </Box>
                <Box>
                    <SlideUpDrawer />
                </Box>
            </Flex>
        </VStack>
    );
};

export default PortraitLayout;
