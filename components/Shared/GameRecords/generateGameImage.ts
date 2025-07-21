import { format } from 'date-fns';
import { convertPNLCurrencyToDisplay } from '../../utils/convertCurrency';
import { convertCurrencyToDisplay } from '../../utils/convertCurrency';
import { formatBlindsWithSymbol } from '../../utils/formatMoney';
import { GameDetails } from '../../hooks/useGameHistory';
import { generateShareGameImage } from '../../../client';

export async function generateGameImage(
    gameId: string,
    username: string,
    date: string,
    blinds: string,
    buy_in: string,
    cash_out: string,
    pnl: string,
): Promise<string> {
    try {
        const response = await generateShareGameImage({
            path: {
                game_id: gameId,
            },
            body: {
                username,
                date,
                blinds,
                buy_in,
                cash_out,
                pnl,
            },
        });

        if (response.error) {
            throw new Error(`HTTP error! status: ${response.error}`);
        }
        const blob = await response.data;
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
}

export const handleShareClick = async (
    gameId: string,
    game: GameDetails,
    user: any,
    smallBlind: number,
    bigBlind: number,
    setImageUrl: (url: string) => void,
    onOpen: () => void,
) => {
    try {
        const url = await generateGameImage(
            gameId,
            user.username,
            format(new Date(game.game_start_time), 'MMM d, yyyy'),
            formatBlindsWithSymbol(smallBlind, bigBlind),
            `$${convertCurrencyToDisplay(game.buy_in)}`,
            `$${convertCurrencyToDisplay(game.cashout)}`,
            convertPNLCurrencyToDisplay(game.buy_in, game.cashout),
        );
        setImageUrl(url);
        onOpen();
    } catch (error) {
        console.error('Error generating image:', error);
    }
};
