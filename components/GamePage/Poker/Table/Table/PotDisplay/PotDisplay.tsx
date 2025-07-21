import { GamePot } from './GamePot';
import { WinningPots } from './WinningPots';
import { usePokerGameState } from '../../../../../hooks/usePokerGameState';
import { PokerGameState } from '../../../../../types/PokerGameState';
import useGameData from '../../../../../hooks/useGameData';

export const PotDisplay = () => {
    const { mainPot, sidePots, pot, streetPot } = useGameData();
    const gameState = usePokerGameState();
    const isPaused = gameState === PokerGameState.SHOWDOWN;
    const isInGame = gameState !== PokerGameState.CREATE;

    if (isPaused) {
        return <WinningPots mainPot={mainPot} sidePots={sidePots} />;
    } else if (isInGame) {
        return <GamePot pot={pot} streetPot={streetPot} />;
    }
    return null;
};
