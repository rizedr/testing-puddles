import { VStack } from '@chakra-ui/react';

import { Spectator } from '../../Spectator';

export const SpectatorBox = () => {
    return (
        <VStack
            h="100%"
            minH="12.5rem"
            w="100%"
            px="1.5rem"
            my="auto"
            alignItems="center"
            justifyContent="center"
            spacing="1rem"
        >
            <Spectator />
        </VStack>
    );
};

export default SpectatorBox;
