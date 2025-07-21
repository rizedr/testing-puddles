import { Player } from '../../client';
import { useGetCurrentPlayer } from './useGetCurrentPlayer';
import useGameData from './useGameData';

const mod = (n: number, m: number) => ((n % m) + m) % m;

interface PlayerUIPositionResult {
    playerPositions: (Player | null)[];
}

/**
 * The player's UI position, as opposed to their actual position in the game.
 * This is because we center the user in the UI for "preferred seating".
 *
 * E.g. If you are actually in the 1st seat in the game, but you are at the 5th
 * seat in the UI (You as the player will always be in the center seat in the UI),
 * then your UI position is 5.
 */
export const useGetPlayerUIPositions = (): PlayerUIPositionResult => {
    const currentPlayer = useGetCurrentPlayer();
    const { players } = useGameData();

    if (players) {
        const _playerPos = Array(9).fill(null);
        players.forEach(
            (player: Player) => (_playerPos[player.index] = player),
        );

        if (currentPlayer) {
            const shiftAmount = mod(4 - currentPlayer.index, 9);
            for (let i = 0; i < shiftAmount; i++) {
                _playerPos.unshift(_playerPos.pop() || null);
            }
        }

        return { playerPositions: _playerPos };
    }

    return { playerPositions: Array(9).fill(null) };
};

export const useGetPlayerUIPosition = (player_id: string): number => {
    const { playerPositions } = useGetPlayerUIPositions();
    return playerPositions.findIndex((p) => p?.player_id === player_id) ?? -1;
};
