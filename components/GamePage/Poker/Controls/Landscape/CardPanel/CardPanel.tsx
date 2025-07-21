import { Flex, VStack, Text, Spacer } from '@chakra-ui/react';

import { GinzaSignInButton } from '../../../../../Shared/AuthButtons';

import Cards from './Cards';
import useUserStatus from '../../../../../hooks/useUserStatus';
import { usePokerGameState } from '../../../../../hooks/usePokerGameState';
import { isInGame, PokerGameState } from '../../../../../types/PokerGameState';
import { ApprovePlayerNotification } from '../../../../../Notifications/ApprovePlayerNotification';
import { useWaitingRoom } from '../../Shared/useWaitingRoom';
import { useIsInGame } from '../../../../../hooks/useIsInGame';

export const CardPanel = () => {
    // const gameState = usePokerGameState();
    // const { isHost } = useWaitingRoom();
    // const isInGame = useIsInGame();
    
    // if (isHost && gameState === PokerGameState.CREATE && !isInGame) {
    //     return (
    //         <Flex h="100%" w="100%">
    //             <Text justifyContent="center" fontWeight="700" textColor="brand.white80">
    //                 Pending Game Requests
    //             </Text>
    //             <VStack 
    //                 backgroundColor="brand.darkerBlueGray"
    //                 position="absolute" 
    //                 top="12%"
    //                 h="85%"    
    //                 w="96%" 
    //                 ml="2%"
    //                 overflow="auto"
    //                 border="1px solid"
    //                 borderColor="rgb(255, 255, 255, 0.25)"
    //                 borderRadius="0.5rem"
    //             >
    //                 <Flex position="relative" top="-4rem" w="100%">
    //                     <ApprovePlayerNotification />
    //                 </Flex>
    //             </VStack>
    //         </Flex>
    //     );
    // }

    // if (gameState === PokerGameState.CREATE || isAway) {
    //     return (
    //         <Flex h="100%" w="100%" justify="center" align="center">
    //             <SignedOut>
    //                 <GinzaSignInButton />
    //             </SignedOut>
    //         </Flex>
    //     );
    // }

    return <Cards />;
};

export default CardPanel;
