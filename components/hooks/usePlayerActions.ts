import { useState, useEffect, useRef } from 'react';

import { Action, playerAction, PlayerActionInput } from '../../client';
import { useGetPlayerRaise } from './useGetPlayerRaise';
import useGameData from './useGameData';
import useViewer from './useViewer';

const isUnnecessaryFold = (decision: Action, betGap: number) => {
    return decision === Action.FOLD && betGap <= 0;
};

const isActionWithAmount = (action: Action) =>
    [Action.CALL, Action.RAISE, Action.ALL_IN].includes(action);

const shouldResetPremove = (
    premove: PlayerActionInput | null,
    minRaise: number,
) => {
    return (
        premove &&
        premove.amount &&
        isActionWithAmount(premove.action) &&
        premove.amount < minRaise
    );
};

export const usePlayerActions = (onUnnecessaryFold?: () => void) => {
    const { userId } = useViewer();
    const { players, currentDecidingPlayer, gameId, streetPot, gameState } =
        useGameData();
    const [premove, setPremove] = useState<PlayerActionInput | null>(null);
    const [premoveAction, setPremoveAction] = useState<Action | null>(null);
    const { minRaise, isMinRaise } = useGetPlayerRaise();
    const prevGameStateRef = useRef(gameState);

    const isCurrentlyDecidingPlayer = currentDecidingPlayer === userId;
    const player = players?.find((p) => p.player_id === userId);
    const maxBetAmount = players.reduce((max, player) => {
        if (!player?.bet_amount) return max;
        return Math.max(max, player.bet_amount);
    }, 0);
    const playerBetAmount = player?.bet_amount ?? 0;
    const betGap = maxBetAmount - playerBetAmount;

    useEffect(() => {
        if (shouldResetPremove(premove, minRaise)) {
            setPremove(null);
        }
    }, [minRaise]);

    useEffect(() => {
        if (gameState !== prevGameStateRef.current && !isCurrentlyDecidingPlayer) {
            setPremove(null);
            prevGameStateRef.current = gameState;
        }
    }, [gameState, isCurrentlyDecidingPlayer]);

    useEffect(() => {
        if (isCurrentlyDecidingPlayer && premove) {
            if (premove.action === Action.CALL && premove.amount !== betGap) {
                setPremove(null);
                return;
            }

            if (premove.action === Action.CHECK && betGap > 0) {
                setPremove(null);
                return;
            }

            if (!premoveAction) {
                setPremoveAction(premove.action);
                playerAction({
                    path: {
                        game_id: gameId,
                    },
                    body: {
                        action: premove.action,
                        amount: premove.action === Action.CALL ? betGap : premove.amount,
                        is_min_raise: isMinRaise(betGap),
                    },
                }).finally(() => {
                    setPremove(null);
                    setPremoveAction(null);
                });
            }
        } else if (premove) {
            if (premove.action === Action.CHECK_OR_FOLD && betGap > 0) {
                setPremove({ action: Action.FOLD, amount: 0 });
                return;
            }
        }
    }, [isCurrentlyDecidingPlayer, premove, gameId, betGap]);

    const noBet = streetPot === 0;

    const onDecisionClick = (decision: Action, confirmFold = false) => {
        if (isUnnecessaryFold(decision, betGap) && !confirmFold) {
            onUnnecessaryFold?.();
        } else if (isCurrentlyDecidingPlayer && !premoveAction) {
            setPremoveAction(decision);
            playerAction({
                path: {
                    game_id: gameId,
                },
                body: {
                    action: decision,
                    amount: Math.ceil(betGap * 1e6),
                    is_min_raise: isMinRaise(betGap),
                },
            }).finally(() => {
                setPremoveAction(null);
            });
        } else {
            setPremove((prev) => {
                if (prev?.action === decision) return null;
                const actionToStore = decision === Action.CALL ? Action.CALL : decision;
                return {
                    action: actionToStore,
                    amount: betGap,
                };
            });
        }
    };

    return {
        betGap,
        isCurrentlyDecidingPlayer,
        premoveAction,
        noBet,
        onDecisionClick,
        premove,
        player,
    };
};
