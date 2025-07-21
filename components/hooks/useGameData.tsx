import { usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../packages/convex/convex/_generated/api';
import { Id } from '../../../../packages/convex/convex/_generated/dataModel';
import { PokerGameData, PokerGameState } from '../../client';

export const useGameData = () => {
    const pathname = usePathname();
    const gameId = pathname?.split('/').pop() as string;
    const gameDataQuery = useQuery(api.tasks.getGameDataPublic, {
        gameId: gameId as Id<'gameData'>,
    });
    const gameData = gameDataQuery?.gameData as PokerGameData;
    return {
        players: gameData?.players ?? [],
        pendingPlayers: gameData?.pending_players ?? [],
        minBuyIn: gameData?.game_settings.min_buy_in,
        maxBuyIn: gameData?.game_settings.max_buy_in,
        smallBlind: gameData?.game_settings.small_blind_value,
        bigBlind: gameData?.game_settings.big_blind_value,
        gameId,
        gameHost: gameData?.game_host,
        board: gameData?.board ?? [],
        currentDecidingPlayer: gameData?.current_deciding_player,
        gameState: gameData?.game_state,
        winnerData: gameData?.winner_data,
        pot: gameData?.pot,
        streetPot: gameData?.street_pot,
        mainPot: gameData?.winner_data?.main_pot,
        sidePots: gameData?.winner_data?.side_pots,
        raiseOptions: gameData?.raise_options,
        legalActions: gameData?.legal_actions ?? [],
        gameSettings: gameData?.game_settings,
        targetTime: gameData?.target_time ?? Number.MAX_SAFE_INTEGER,
        playersToAdd: gameData?.players_to_add ?? [],
        playersToAway: gameData?.players_to_away ?? [],
        dealer: gameData?.dealer,
        rabbitHuntBoard: gameData?.rabbit_hunt_board ?? [],
        runItTwice: gameData?.run_it_twice,
        isLoading: gameData === undefined,
        extraTimeActivated: gameData?.extra_time_activated ?? false,
        topUps: gameData?.top_ups ?? [],
        archived: gameData?.archived ?? false,
        vpipArchive: gameData?.vpip_archive ?? {},
        bombPotEligible: gameData?.bomb_pot_eligible,
        extraTime: gameData?.game_settings?.extra_time ?? 20,
    };
};

export default useGameData;
