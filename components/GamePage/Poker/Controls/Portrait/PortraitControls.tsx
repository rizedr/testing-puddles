import { Box, Flex, useDisclosure } from '@chakra-ui/react';

import { useUserStatus } from '../../../../hooks/useUserStatus';
import { useIsPendingPlayer } from '../../../../hooks/useIsPendingPlayer';
import { usePokerGameState } from '../../../../hooks/usePokerGameState';
import { PokerGameState } from '../../../../types/PokerGameState';

import ActionBox from '../Shared/Actions/ActionBox/ActionBox';
import RaiseMenu from '../Shared/Actions/RaiseMenu/RaiseMenu';
import { PendingBox } from '../Shared/Actions/NonActions/PendingBox';
import { Spectator } from '../Shared/Spectator';
import AwayBox from '../Shared/Actions/NonActions/AwayBox';
import { ShowCards } from './ShowCards/ShowCards';
import { PortraitWaitingRoom } from './PortraitWaitingRoom';

export const PortraitControls = () => {
    const { isSpectator, isAway } = useUserStatus();
    const isPendingPlayer = useIsPendingPlayer();
    const gameState = usePokerGameState();
    const {
        isOpen: isRaiseMenuOpen,
        onOpen: onOpenRaiseMenu,
        onClose: onCloseRaiseMenu,
    } = useDisclosure();

    const isInGame = gameState !== PokerGameState.CREATE;
    const shouldSpectate = isSpectator && !isPendingPlayer;
    const shouldShowActions =
        isInGame &&
        !isRaiseMenuOpen &&
        !isSpectator &&
        !isPendingPlayer &&
        !isAway;
    const shouldShowWaitingRoom =
        !isInGame && !isPendingPlayer && !shouldSpectate;
    const shouldShowCards =
        gameState === PokerGameState.SHOWDOWN && !isSpectator && !isAway;

    return (
        <Flex
            position="relative"
            align="center"
            height="100%"
            mx="auto"
            justify="center"
            zIndex={1000}
        >
            {shouldSpectate && <Spectator />}
            {shouldShowWaitingRoom && <PortraitWaitingRoom />}
            {isAway && <AwayBox />}
            {shouldShowActions && (
                <ActionBox
                    onOpenRaiseMenu={onOpenRaiseMenu}
                    onCloseRaiseMenu={onCloseRaiseMenu}
                >
                    {shouldShowCards && <ShowCards />}
                </ActionBox>
            )}
            {isRaiseMenuOpen && (
                <RaiseMenu onCloseRaiseMenu={onCloseRaiseMenu} />
            )}
            {isPendingPlayer && (
                <Box display="flex" justifyContent="center">
                    <PendingBox />
                </Box>
            )}
        </Flex>
    );
};

export default PortraitControls;
