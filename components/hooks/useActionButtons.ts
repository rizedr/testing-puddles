import { useDisclosure } from '@chakra-ui/react';

import { Action, GameState } from '../../client';
import { usePlayerActions } from './usePlayerActions';
import { formatMicroDollarsWithCommas } from '../utils/formatMoney';
import useGameData from './useGameData';
import { useHasPhysicalKeyboard } from './useHasPhysicalKeyboard';
import useViewer from './useViewer';
import { useActionBox } from '../GamePage/Poker/Controls/Shared/Actions/ActionBox/useActionBox';
import { useMoneyDisplay } from '../Shared/MoneyDisplay';
import { useGetCurrentPlayer } from './useGetCurrentPlayer';

export interface ActionInterface {
    text: string;
    onClick: () => void;
    isDisabled: boolean;
    isLoading: boolean;
    variant: string;
}

type GameAction = Extract<
    Action,
    | Action.FOLD
    | Action.CALL
    | Action.CHECK
    | Action.CHECK_OR_FOLD
    | Action.RAISE
    | Action.ALL_IN
>;

const getActionButtonVariant = (isActive: boolean, action: GameAction) => {
    if (!isActive) return 'primaryDark';

    switch (action) {
        case Action.CHECK:
        case Action.CHECK_OR_FOLD:
        case Action.CALL:
            return 'callButton';
        case Action.FOLD:
            return 'foldButton';
        case Action.RAISE:
        case Action.ALL_IN:
            return 'raiseButton';
    }
};

const useActionButtonTextMap = (betGap: number, noBet: boolean) => {
    const hasPhysicalKeyboard = useHasPhysicalKeyboard();
    const { user } = useViewer();
    const keyboardShortcuts = user?.pokerPreferences?.keyboardShortcuts ?? true;
    const callAmountDisplay = useMoneyDisplay(betGap);
    return {
        [Action.FOLD]: `Fold${hasPhysicalKeyboard && keyboardShortcuts ? ' [F]' : ''}`,
        [Action.CALL]: `Call ${callAmountDisplay} ${hasPhysicalKeyboard && keyboardShortcuts ? ' [C]' : ''}`,
        [Action.CHECK_OR_FOLD]: `Check/Fold${hasPhysicalKeyboard && keyboardShortcuts ? ' [O]' : ''}`,
        [Action.CHECK]: `Check${hasPhysicalKeyboard && keyboardShortcuts ? ' [K]' : ''}`,
        [Action.RAISE]: noBet
            ? `Bet${hasPhysicalKeyboard && keyboardShortcuts ? ' [R]' : ''}`
            : `Raise${hasPhysicalKeyboard && keyboardShortcuts ? ' [R]' : ''}`,
        [Action.ALL_IN]: 'All in',
    };
};

const useLegalActions = (isCurrentlyDecidingPlayer: boolean, betGap: number) => {
    const { legalActions } = useGameData();
    const currentPlayer = useGetCurrentPlayer();
    const currentUserAmount = currentPlayer?.amount || 0;

    if (isCurrentlyDecidingPlayer) {
        return legalActions;
    } else {
        const fallback: GameAction[] = [];
        if (betGap > 0) {
            fallback.push(Action.FOLD);

            if (currentUserAmount >= betGap) {
                fallback.push(Action.CALL);
            } else if (currentUserAmount > 0) {
                fallback.push(Action.ALL_IN);
            }
        } else {
            fallback.push(Action.CHECK);
            fallback.push(Action.CHECK_OR_FOLD);
        }
        return fallback;
    }
};

export const useActionButtons = (onOpenRaiseMenu: () => void) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        betGap,
        isCurrentlyDecidingPlayer,
        premoveAction,
        noBet,
        onDecisionClick,
        premove,
    } = usePlayerActions(onOpen);
    const legalActions = useLegalActions(isCurrentlyDecidingPlayer, betGap);
    const actionTextMap = useActionButtonTextMap(betGap, noBet);

    const makeAction = (action: GameAction): ActionInterface => {
        let isDisabled =
            premoveAction !== null ||
            (!isCurrentlyDecidingPlayer && action === Action.RAISE);
        return {
            text: actionTextMap[action],
            onClick: () =>
                action === Action.RAISE
                    ? onOpenRaiseMenu()
                    : onDecisionClick(action),
            isDisabled,
            isLoading: premoveAction === action,
            variant: getActionButtonVariant(
                isCurrentlyDecidingPlayer || premove?.action === action,
                action,
            ),
        };
    };

    const decisionMap: Map<GameAction, ActionInterface> = new Map(
        legalActions.map((action: GameAction) => [action, makeAction(action)]),
    );

    return {
        decisionMap,
        isCurrentlyDecidingPlayer,
        isOpen,
        onClose,
        onDecisionClick,
    };
};
