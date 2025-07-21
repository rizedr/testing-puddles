import { Text, VStack } from '@chakra-ui/react';

import { GinzaSignInButton } from '../../../../Shared/AuthButtons';
import { SignedOut } from '@clerk/nextjs';

export const Spectator = () => {
    return (
        <VStack
            px="1rem"
            alignItems="center"
            justifyContent="center"
            spacing="0.5rem"
            h="100%"
        >
            <VStack spacing="0rem">
                <Text size="md" variant="bold">
                    You are currently a spectator.
                </Text>
                <Text size="md" variant="bold">
                    Please select a seat to join the game.
                </Text>
            </VStack>
            <SignedOut>
                <GinzaSignInButton />
            </SignedOut>
        </VStack>
    );
};

export default Spectator;
