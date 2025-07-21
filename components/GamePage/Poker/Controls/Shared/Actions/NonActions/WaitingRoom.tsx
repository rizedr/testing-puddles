import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { useWaitingRoom } from '../../useWaitingRoom';
import { CopyIcon } from '@chakra-ui/icons';

export const WaitingRoom = () => {
    const { isHost, url, copyURL } = useWaitingRoom();

    return (
        <>
            <VStack
                paddingX="1.5rem"
                my="auto"
                w="100%"
                justifyContent="center"
                spacing="0.5rem"
            >
                <Text
                    size="md"
                    variant="bold"
                    textAlign="center"
                    whiteSpace="pre-wrap"
                >
                    <br /> Share the link to invite your friends and earn
                    rewards!
                </Text>
                <HStack
                    spacing=".5rem"
                    w="100%"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Text
                        border="none"
                        bg="brand.gray30"
                        paddingX="1.5rem"
                        paddingY="0.8rem"
                        textColor="brand.white70"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textAlign="center"
                        h="3.1rem"
                        fontStyle="italic"
                    >
                        {url}
                    </Text>
                    <Button
                        variant="walletButton"
                        h="3rem"
                        w="3.3rem"
                        onClick={copyURL}
                        fontWeight="bold"
                    >
                        <CopyIcon color="white" w="1.15rem" h="1.15rem" />
                    </Button>
                </HStack>
                <Text
                    size="md"
                    variant="bold"
                    textAlign="center"
                    whiteSpace="pre-wrap"
                    mt="1rem"
                >
                    {isHost
                        ? 'Press "Start Game" above to begin!'
                        : 'Waiting for the host to start the game...'}
                </Text>
            </VStack>
        </>
    );
};

export default WaitingRoom;
