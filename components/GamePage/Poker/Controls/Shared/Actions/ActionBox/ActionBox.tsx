import { Text, useBreakpointValue, VStack } from '@chakra-ui/react';

import ActionButtons from './ActionButtons';
import { useActionBox } from './useActionBox';
import { PlayerStack } from './PlayerStack';

import { useUserStatus } from '../../../../../../hooks/useUserStatus';
import { usePokerGameState } from '../../../../../../hooks/usePokerGameState';

import { isInShowdown } from '../../../../../../types/PokerGameState';

/**
 * ActionBox displays in game player actions & information
 */
export const ActionBox = ({
    children,
    onOpenRaiseMenu,
    onCloseRaiseMenu,
}: {
    children?: React.ReactNode;
    onOpenRaiseMenu: () => void;
    onCloseRaiseMenu: () => void;
}) => {
    const { isFolded, isWinner, isAway } = useUserStatus();
    const { shouldShowActions, isCurrentDecidingPlayer, shouldShowAllIn } =
        useActionBox();
    const gameState = usePokerGameState();
    const showText = isInShowdown(gameState) && !isAway;

    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    const actionInfoText =
        !isInShowdown(gameState) && isFolded
            ? 'You Folded'
            : showText
              ? isWinner
                  ? 'You win!'
                  : 'Onto the next round'
              : shouldShowAllIn
                ? 'You are all in.'
                : '';

    return (
        <VStack
            w="100%"
            h="100%"
            px="1.5rem"
            alignItems="center"
            spacing="1rem"
            position="relative"
            justifyContent="center"
        >
            {/* In portrait: ShowCards. In landscape: Nothing. */}
            {children}
            <PlayerStack />
            {shouldShowActions && (
                <VStack spacing="1rem" w="100%">
                    <ActionButtons
                        onOpenRaiseMenu={onOpenRaiseMenu}
                        onCloseRaiseMenu={onCloseRaiseMenu}
                    />
                    <Text 
                        variant="actionInfoText"
                        color={isCurrentDecidingPlayer ? 'brand.accentWhite' : undefined}
                    >
                        {isCurrentDecidingPlayer
                            ? 'Your Turn'
                            : 'Next Turn Actions'}
                    </Text>
                </VStack>
            )}
            {actionInfoText && isWinner && !isPortrait && (
                <Text
                    variant="actionInfoText"
                    size="md"
                    color={isWinner ? 'brand.accentWhite' : undefined}
                >
                    {actionInfoText}
                </Text>
            )}
        </VStack>
    );
};

export default ActionBox;
