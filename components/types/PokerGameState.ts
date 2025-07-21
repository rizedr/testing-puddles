import { GameState } from '../../client';

export enum PokerGameState {
    CREATE = 0,
    PRE_FLOP = 1,
    FLOP = 2,
    TURN = 3,
    RIVER = 4,
    SHOWDOWN = 5,
    RESET = 6,
    RUN_IT_TWICE_FLOP = 7,
    RUN_IT_TWICE_TURN = 8,
    RUN_IT_TWICE_RIVER = 9,
    DEAL_CHOICE = 10,
    ANTE = 11,
}

export const getPokerGameState = (gameState: GameState): PokerGameState => {
    switch (gameState) {
        case GameState.CREATE:
            return PokerGameState.CREATE;
        case GameState.PRE_FLOP:
            return PokerGameState.PRE_FLOP;
        case GameState.FLOP:
            return PokerGameState.FLOP;
        case GameState.TURN:
            return PokerGameState.TURN;
        case GameState.RIVER:
            return PokerGameState.RIVER;
        case GameState.WINNERS:
            return PokerGameState.SHOWDOWN;
        case GameState.RESET_HAND:
            return PokerGameState.RESET;
        case GameState.RUN_IT_TWICE_FLOP:
            return PokerGameState.RUN_IT_TWICE_FLOP;
        case GameState.RUN_IT_TWICE_TURN:
            return PokerGameState.RUN_IT_TWICE_TURN;
        case GameState.RUN_IT_TWICE_RIVER:
            return PokerGameState.RUN_IT_TWICE_RIVER;
        case GameState.DEAL_CHOICE:
            return PokerGameState.DEAL_CHOICE;
        case GameState.ANTE:
            return PokerGameState.ANTE;
        default:
            return PokerGameState.CREATE;
    }
};

export const isInSetup = (gameState: PokerGameState) =>
    [PokerGameState.CREATE].includes(gameState);

export const isBetweenGames = (gameState: PokerGameState) =>
    [PokerGameState.SHOWDOWN, PokerGameState.RESET].includes(gameState);

export const isInShowdown = (gameState: PokerGameState) =>
    gameState === PokerGameState.SHOWDOWN;

export const isInGame = (gameState: PokerGameState) =>
    [
        PokerGameState.PRE_FLOP,
        PokerGameState.FLOP,
        PokerGameState.TURN,
        PokerGameState.RIVER,
        PokerGameState.RUN_IT_TWICE_FLOP,
        PokerGameState.RUN_IT_TWICE_TURN,
        PokerGameState.RUN_IT_TWICE_RIVER,
        PokerGameState.DEAL_CHOICE,
        PokerGameState.ANTE,
    ].includes(gameState);

export const isSecondBoard = (gameState: PokerGameState) =>
    [
        PokerGameState.RUN_IT_TWICE_FLOP,
        PokerGameState.RUN_IT_TWICE_TURN,
        PokerGameState.RUN_IT_TWICE_RIVER,
    ].includes(gameState);
