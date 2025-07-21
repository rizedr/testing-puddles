import { HStack, Text, VStack } from '@chakra-ui/react';
import {
    AddMode,
    Action,
    playerAction,
    PokerGameState,
} from '../../../../../../../client';
import useGameData from '../../../../../../hooks/useGameData';

import { useGetCurrentPlayer } from '../../../../../../hooks/useGetCurrentPlayer';
import { formatMicroDollarsWithCommas } from '../../../../../../utils/formatMoney';
import APIButton from '../../../../../../Shared/APIButton';

/**
 * Handles away state for user.
 *
 * A user can be in one of the following states:
 * - Away
 * - Waiting for blinds
 * - Posting blinds
 *
 * A user can also cancel waiting or posting blinds if they change their mind.
 */
export const AwayBox = () => {
    const { gameId, gameSettings, playersToAdd, gameState } = useGameData();
    const smallBlind = gameSettings?.small_blind_value;
    const bigBlind = gameSettings?.big_blind_value;
    const currentPlayer = useGetCurrentPlayer();
    const isToAdd = playersToAdd.find(
        (p) => p.player_id === currentPlayer?.player_id,
    );
    const isWaitingForBlinds =
        isToAdd && isToAdd.add_mode === AddMode.WAIT_FOR_BLINDS;
    const isPostingBlinds = isToAdd && isToAdd.add_mode === AddMode.POST_BLINDS;

    const isAway = currentPlayer?.action === Action.AWAY;

    const waitForBlindsButtonText =
        gameState === PokerGameState.CREATE ? "I'm back" : 'Wait for Blinds';
    return (
        <VStack paddingX="2rem" my="auto" w="100%" justifyContent="center">
            <HStack>
                {isToAdd && (
                    <APIButton
                        variant={'walletButton'}
                        endpoint={playerAction}
                        params={{
                            path: {
                                game_id: gameId,
                            },
                            body: {
                                action: Action.CANCEL_RETURN_TO_GAME,
                            },
                        }}
                    >
                        Cancel Request
                    </APIButton>
                )}
                {isAway && !isToAdd && (
                    <>
                        {gameState !== PokerGameState.CREATE && (
                            <APIButton
                                variant={'walletButton'}
                                endpoint={playerAction}
                                params={{
                                    path: {
                                        game_id: gameId,
                                    },
                                    body: {
                                        action: Action.POST_BLINDS,
                                    },
                                }}
                            >
                                Post Blinds ($
                                {formatMicroDollarsWithCommas(
                                    bigBlind + smallBlind,
                                )}
                                )
                            </APIButton>
                        )}
                        <APIButton
                            variant={'walletButton'}
                            endpoint={playerAction}
                            params={{
                                path: {
                                    game_id: gameId,
                                },
                                body: {
                                    action: Action.WAIT_FOR_BLINDS,
                                },
                            }}
                        >
                            {waitForBlindsButtonText}
                        </APIButton>
                    </>
                )}
            </HStack>
            <Text
                size="md"
                variant="bold"
                textAlign="center"
                whiteSpace="pre-wrap"
            >
                {isAway &&
                    !isToAdd &&
                    'You are currently sitting out. Select an option to return to the game.'}
                {isWaitingForBlinds &&
                    `You are waiting for blinds ($${formatMicroDollarsWithCommas(
                        bigBlind,
                    )}) next round.`}
                {isPostingBlinds &&
                    `You are posting blinds ($${formatMicroDollarsWithCommas(
                        bigBlind + smallBlind,
                    )}) next round.`}
            </Text>
        </VStack>
    );
};

export default AwayBox;
