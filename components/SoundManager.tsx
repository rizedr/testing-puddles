'use client';

import { useEffect, useState, useRef } from 'react';
import React from 'react';

import { Action } from '../client';
import { PokerGameState } from './types/PokerGameState';
import { usePokerGameState } from './hooks/usePokerGameState';
import { useGetCurrentPlayer } from './hooks/useGetCurrentPlayer';
import { useIsGameHost } from './hooks/useIsGameHost';
import useGameData from './hooks/useGameData';

let knock: HTMLAudioElement | null = null;
let cardReveal: HTMLAudioElement | null = null;
let chips: HTMLAudioElement | null = null;
let winner: HTMLAudioElement | null = null;
let playerNotification: HTMLAudioElement | null = null;
let fold: HTMLAudioElement | null = null;
let activeTurn: HTMLAudioElement | null = null;
let timerAudio: HTMLAudioElement | null = null;

if (typeof window !== 'undefined') {
    knock = new Audio('/Sounds/knock.mp3');
    cardReveal = new Audio('/Sounds/cardReveal.mp3');
    chips = new Audio('/Sounds/chips.mp3');
    winner = new Audio('/Sounds/winner.mp3');
    playerNotification = new Audio('/Sounds/playerNotif.mp3');
    fold = new Audio('/Sounds/fold.mp3');
    activeTurn = new Audio('/Sounds/activeTurn.mp3');
    timerAudio = new Audio('/Sounds/timer2.mp3');
}

const playSound = (
    audioRef: React.RefObject<HTMLAudioElement | null>,
    volume: number = 1,
    delay: number = 0,
    isMuted: boolean = false,
) => {
    if (isMuted) return;
    setTimeout(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.play();
        }
    }, delay);
};

const SoundManager: React.FC = () => {
    const knockRef = useRef(knock);
    const cardRevealRef = useRef(cardReveal);
    const chipsRef = useRef(chips);
    const winnerRef = useRef(winner);
    const foldRef = useRef(fold);
    const activeTurnRef = useRef(activeTurn);
    const playerNotificationRef = useRef(playerNotification);
    const timerAudioRef = useRef(timerAudio);
    const isHost = useIsGameHost();

    const isMuted =
        typeof window !== 'undefined'
            ? window.localStorage.getItem('isMuted') === 'true'
            : true;

    const [lastPlayerId, setLastPlayerId] = useState<string | null>(null);
    const [nMainBoardRevealed, setNMainBoardRevealed] = useState(0);
    const [nSecondBoardRevealed, setNSecondBoardRevealed] = useState(0);
    const [numPendingPlayers, setPendingPlayersCount] = useState(0);
    const [timerSoundPlayed, setTimerSoundPlayed] = useState(false);

    const {
        currentDecidingPlayer: currDecPlayerId,
        pendingPlayers,
        players,
        board,
        targetTime,
        gameSettings,
        runItTwice,
    } = useGameData();

    const gameState = usePokerGameState();
    const currentPlayer = useGetCurrentPlayer();
    const currPlayerId = currentPlayer?.player_id;

    const turnTime = gameSettings?.turn_time;

    useEffect(() => {
        if (!currPlayerId || !currDecPlayerId) return;

        const isYourTurn =
            currDecPlayerId === currPlayerId &&
            lastPlayerId !== currDecPlayerId;

        if (isYourTurn) {
            playSound(activeTurnRef, 1, 500, isMuted);
        }

        const isNewTurn = lastPlayerId && currDecPlayerId !== lastPlayerId;
        if (isNewTurn) {
            const prevP = players.find((p: any) => p.player_id === lastPlayerId);

            if (prevP && prevP.action) {
                switch (prevP.action) {
                    case Action.CHECK:
                        playSound(knockRef, 1, 0, isMuted);
                        break;
                    case Action.CALL:
                    case Action.RAISE:
                        playSound(chipsRef, 1, 0, isMuted);
                        break;
                    case Action.FOLD:
                        playSound(foldRef, 1, 0, isMuted);
                        break;
                    default:
                        break;
                }
            }
            setLastPlayerId(currDecPlayerId);
        } else if (currDecPlayerId && !lastPlayerId) {
            setLastPlayerId(currDecPlayerId);
        }
    }, [currDecPlayerId, players, currPlayerId, isMuted]);

    useEffect(() => {
        if (gameState === PokerGameState.SHOWDOWN)
            playSound(winnerRef, 1, 0, isMuted);
    }, [gameState, isMuted]);

    useEffect(() => {
        // Main board card reveal sound
        if (!board || board.length <= nMainBoardRevealed) return;
        setNMainBoardRevealed(board.length);
        playSound(cardRevealRef, 1, 250, isMuted);
    }, [board, nMainBoardRevealed, isMuted]);

    useEffect(() => {
        // Run it twice second board card reveal sound
        if (!runItTwice?.second_board || runItTwice.second_board.length <= nSecondBoardRevealed) return;
        setNSecondBoardRevealed(runItTwice.second_board.length);
        playSound(cardRevealRef, 1, 250, isMuted);
    }, [runItTwice, nSecondBoardRevealed, isMuted]);

    useEffect(() => {
        // Reset revealed counts on state changes
        if (gameState === PokerGameState.PRE_FLOP) {
            setNMainBoardRevealed(0);
            setNSecondBoardRevealed(0);
        } else if (gameState === PokerGameState.RUN_IT_TWICE_FLOP) {
            setNSecondBoardRevealed(3);
        }
    }, [gameState]);

    useEffect(() => {
        const numCurrPendingPlayers = pendingPlayers?.length;
        const isNewPendingPlayers = numCurrPendingPlayers > numPendingPlayers;
        if (isNewPendingPlayers && isHost) {
            playSound(playerNotificationRef, 1, 0, isMuted);
        }
        setPendingPlayersCount(numCurrPendingPlayers);
    }, [pendingPlayers, isMuted, isHost]);

    useEffect(() => {
        if (isMuted || !turnTime || currPlayerId !== currDecPlayerId) return;

        const fiveSecondsLeftThreshold = 5.75;
        const checkAndPlayTimerAudio = () => {
            const now = Date.now() / 1000;
            const timeLeft = targetTime - now;

            if (timeLeft <= fiveSecondsLeftThreshold && timeLeft > 0 && !timerSoundPlayed) {
                playSound(timerAudioRef, 1, 0, isMuted);
                setTimerSoundPlayed(true);
            }
        };

        const intervalId = setInterval(checkAndPlayTimerAudio, 1000);
        return () => clearInterval(intervalId);
    }, [
        turnTime,
        targetTime,
        isMuted,
        currPlayerId,
        currDecPlayerId,
        timerSoundPlayed,
    ]);

    useEffect(() => {
        // If the current player changes, stop the timer sound immediately and reset the flag
        if (currPlayerId !== currDecPlayerId && timerAudioRef.current) {
            timerAudioRef.current.pause();
            timerAudioRef.current.currentTime = 0;
            setTimerSoundPlayed(false);
        }
    }, [currPlayerId, currDecPlayerId]);

    return <></>;
};

export default SoundManager;
