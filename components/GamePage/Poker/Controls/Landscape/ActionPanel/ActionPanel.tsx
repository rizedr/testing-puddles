import { Box, Flex, useDisclosure } from '@chakra-ui/react';

import { useUserStatus } from '../../../../../hooks/useUserStatus';
import { useIsPendingPlayer } from '../../../../../hooks/useIsPendingPlayer';

import WaitingRoom from '../../Shared/Actions/NonActions/WaitingRoom';
import ActionBox from '../../Shared/Actions/ActionBox/ActionBox';
import RaiseMenu from '../../Shared/Actions/RaiseMenu/RaiseMenu';
import SpectatorBox from '../../Shared/Actions/NonActions/SpectatorBox';
import { PendingBox } from '../../Shared/Actions/NonActions/PendingBox';
import { useIsInGame } from '../../../../../hooks/useIsInGame';
import AwayBox from '../../Shared/Actions/NonActions/AwayBox';
import { keyframes } from '@emotion/react';

export const ActionPanel = () => {
    const { isWinner, isSpectator, isCurrentDecidingPlayer, isAway } =
        useUserStatus();
    const isPendingPlayer = useIsPendingPlayer();
    const {
        isOpen: isRaiseMenuOpen,
        onOpen: onOpenRaiseMenu,
        onClose: onCloseRaiseMenu,
    } = useDisclosure();

    const isInGame = useIsInGame();

    const outerBg = isWinner
        ? 'brand.vividGreen'
        : isCurrentDecidingPlayer
          ? 'rgba(202, 235, 237, 1.0)'
          : 'brand.mutedGray';

    const innerBg = isCurrentDecidingPlayer
        ? 'brand.darkerBlueGray'
        : '#191B20';

    // TODO: revisit decision between 'rgba(202, 235, 237, 1.0)' and 'rgba(172, 211, 237, 1.0)'
    const shouldGlow = isWinner || isCurrentDecidingPlayer;
    const glowColor = isWinner ? '#66F28D' : 'rgba(202, 235, 237, 1.0)';

    const borderGlowAnimation = shouldGlow
        ? `${keyframes`
            0%, 100% {
                filter: drop-shadow(0 0 2.5px ${glowColor}) drop-shadow(0 0 5px ${glowColor});
            }
        `} 2s ease-in-out infinite`
        : undefined;

    const shouldSpectate = isSpectator && isInGame && !isPendingPlayer;
    const shouldShowActions =
        isInGame &&
        !isRaiseMenuOpen &&
        !isSpectator &&
        !isPendingPlayer &&
        !isAway;
    const shouldShowWaitingRoom =
        !isInGame && !isPendingPlayer && !shouldSpectate;

    const remValue = 3;
    const heightValue =
        Math.sqrt(remValue * remValue + remValue * remValue) + 'rem';

    return (
        <Box
            h="100%"
            w="100%"
            fill="rgba(47, 51, 58, 0.20)"
            stroke="#484E59"
            filter="drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25))"
            animation={borderGlowAnimation}
        >
            <Box h="100%" bg={outerBg} padding={'0.125rem'}>
                <Flex alignItems="center" h="100%" bg={innerBg}>
                    {shouldSpectate && <SpectatorBox />}
                    {shouldShowActions && (
                        <ActionBox
                            onOpenRaiseMenu={onOpenRaiseMenu}
                            onCloseRaiseMenu={onCloseRaiseMenu}
                        />
                    )}
                    {isRaiseMenuOpen && (
                        <RaiseMenu onCloseRaiseMenu={onCloseRaiseMenu} />
                    )}
                    {shouldShowWaitingRoom && !isAway && <WaitingRoom />}
                    {isPendingPlayer && <PendingBox />}
                    {isAway && <AwayBox />}
                </Flex>
            </Box>
        </Box>
    );
};

export default ActionPanel;
