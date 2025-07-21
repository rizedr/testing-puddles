import { Action, playerAction } from '../../client';
import useGameId from './useGameID';

/**
 * Used to show a card from the Player's hand
 */
export const useShowCard = () => {
    const gameId = useGameId();

    const showCard = (cardIndex: number = 0) => {
        playerAction({
            path: {
                game_id: gameId,
            },
            body: {
                action: Action.SHOW_CARD,
                card_index: cardIndex,
            },
        });
    };

    return { showCard };
};

export default useShowCard;
