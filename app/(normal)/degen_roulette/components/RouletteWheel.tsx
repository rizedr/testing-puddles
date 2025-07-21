import { Box, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef, MouseEvent } from 'react';
import type { Player } from './types';
import { stringToRouletteColor } from '../utils/colors';
import { PlayerRow } from './PlayerRow';
import Confetti from 'react-confetti';

import { useQueries } from '@tanstack/react-query';
import { api } from '../../../../../../packages/convex/convex/_generated/api';
import { useConvex } from 'convex/react';
import { formatMicroDollars } from '../../../../components/utils/formatMoney';
interface RouletteWheelProps {
    players: Player[];
    totalBet: number;
    winner?: string | null;
}

export const RouletteWheel = ({
    players,
    totalBet,
    winner,
}: RouletteWheelProps) => {
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [isClicked, setIsClicked] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [rotation, setRotation] = useState(0);
    const [isSpinComplete, setIsSpinComplete] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    const convex = useConvex();
    const userQueries = useQueries({
        queries: players.map((player) => {
            return {
                queryKey: ['user', player.player_id],
                queryFn: () =>
                    convex.query(api.tasks.getUserByUserId, {
                        userId: player.player_id,
                    }),
            };
        }),
    });

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = event.target as Element;
            if (target.tagName === 'path') {
                return;
            }
            setSelectedPlayer(null);
            setIsClicked(false);
            setPopupPosition(null);
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const updatePopupPosition = (
        player: { player_id: string },
        midRad: number,
    ) => {
        const svg = svgRef.current;
        if (svg) {
            const rect = svg.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const radius = rect.width * 0.2;
            const x = centerX + radius * Math.cos(midRad);
            const y = centerY + radius * Math.sin(midRad);
            setPopupPosition({ x, y });
        }
    };

    const handleSegmentClick = (
        player: { player_id: string },
        midRad: number,
        event: React.MouseEvent,
    ) => {
        event.stopPropagation();
        setSelectedPlayer(player.player_id);
        setIsClicked(true);
        updatePopupPosition(player, midRad);
    };

    const handleHoverStart = (
        player: { player_id: string },
        midRad: number,
    ) => {
        if (!isClicked) {
            setSelectedPlayer(player.player_id);
            updatePopupPosition(player, midRad);
        }
    };

    const handleHoverEnd = () => {
        if (!isClicked) {
            setSelectedPlayer(null);
            setPopupPosition(null);
        }
    };

    let currentAngle = 0;

    const calculateWinnerRotation = () => {
        if (!winner) return 0;
        let angleSum = 0;
        for (const player of players) {
            const angle = (player.bet_amount / totalBet) * 360;
            if (player.player_id === winner) {
                // Ensures at least 3 full rotations (1080 degrees) plus up to 5 more rotations
                const rotations = -(3 + Math.floor(Math.random() * 5)); // Will give -3 to -7 rotations
                const randomOffset = Math.random() * angle;
                const finalAngle = angleSum + randomOffset + 90;
                return rotations * 360 - finalAngle;
            }
            angleSum += angle;
        }
        return 0;
    };

    useEffect(() => {
        if (winner) {
            setIsSpinComplete(false);
            setShowConfetti(false);
            const targetRotation = calculateWinnerRotation();
            setRotation(targetRotation);
        }
    }, [winner]);

    const winnerPlayer = players.find((p) => p.player_id === winner);
    const multiplier = winnerPlayer ? totalBet / winnerPlayer.bet_amount : 0;

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Box
            w="100%"
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
        >
            <Box
                position="absolute"
                zIndex={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                width="100%"
                height="100%"
                pointerEvents="none"
            >
                {(!winner || !isSpinComplete) && (
                    <Box display="flex" alignItems="center">
                        <Image
                            src="/GinzaCoin.png"
                            w="36px"
                            h="36px"
                            alt="Ginza Coin"
                            style={{ marginRight: '4px' }}
                        />
                        <Box
                            as="span"
                            color="white"
                            fontSize="36px"
                            fontWeight="bold"
                        >
                            {formatMicroDollars(totalBet)}
                        </Box>
                    </Box>
                )}
            </Box>

            <svg
                style={{
                    position: 'absolute',
                    width: '80%',
                    height: '80%',
                    pointerEvents: 'none',
                    zIndex: 1,
                }}
                viewBox="-100 -100 200 200"
            >
                <path
                    d="M -5,-95 L 5,-95 L 0,-85 Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1"
                />
            </svg>

            <motion.svg
                ref={svgRef}
                viewBox="-100 -100 200 200"
                style={{ width: '80%', height: '80%' }}
                animate={{
                    rotate: rotation,
                }}
                transition={{
                    duration: 4,
                    ease: [0.32, 0.95, 0.45, 1],
                    type: 'tween',
                }}
                onAnimationComplete={() => {
                    setIsSpinComplete(true);
                    if (winner) {
                        setShowConfetti(true);
                    }
                }}
            >
                <circle
                    r="90"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                />
                <circle
                    r="50"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                />

                {players.map((player) => {
                    if (players.length === 1) {
                        const midRad = Math.PI;

                        return (
                            <motion.g
                                key={player.player_id}
                                onClick={(e) =>
                                    handleSegmentClick(player, midRad, e)
                                }
                                onHoverStart={() =>
                                    handleHoverStart(player, midRad)
                                }
                                onHoverEnd={handleHoverEnd}
                                style={{ cursor: 'pointer' }}
                            >
                                <motion.path
                                    d="M 90,0 A 90,90 0 1 1 -90,0 A 90,90 0 1 1 90,0 M 50,0 A 50,50 0 1 0 -50,0 A 50,50 0 1 0 50,0"
                                    fill={stringToRouletteColor(
                                        player.player_id,
                                    )}
                                    opacity={
                                        selectedPlayer
                                            ? selectedPlayer ===
                                              player.player_id
                                                ? 1
                                                : 0.3
                                            : 1
                                    }
                                    stroke={
                                        selectedPlayer === player.player_id &&
                                        isClicked
                                            ? 'white'
                                            : 'transparent'
                                    }
                                    strokeWidth={2}
                                    animate={{
                                        scale:
                                            selectedPlayer === player.player_id
                                                ? 1.05
                                                : 1,
                                        transformOrigin: '50% 50%',
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        transformOrigin: '50% 50%',
                                        transition: { duration: 0.2 },
                                    }}
                                />
                            </motion.g>
                        );
                    }

                    const angle = (player.bet_amount / totalBet) * 360;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;
                    const midAngle = startAngle + angle / 2;
                    const midRad = (midAngle * Math.PI) / 180;

                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;

                    const startX =
                        Math.round(90 * Math.cos(startRad) * 1000) / 1000;
                    const startY =
                        Math.round(90 * Math.sin(startRad) * 1000) / 1000;
                    const endX =
                        Math.round(90 * Math.cos(endRad) * 1000) / 1000;
                    const endY =
                        Math.round(90 * Math.sin(endRad) * 1000) / 1000;

                    const innerStartX =
                        Math.round(50 * Math.cos(startRad) * 1000) / 1000;
                    const innerStartY =
                        Math.round(50 * Math.sin(startRad) * 1000) / 1000;
                    const innerEndX =
                        Math.round(50 * Math.cos(endRad) * 1000) / 1000;
                    const innerEndY =
                        Math.round(50 * Math.sin(endRad) * 1000) / 1000;

                    const largeArcFlag = angle > 180 ? 1 : 0;

                    currentAngle += angle;

                    const isSelected = selectedPlayer === player.player_id;

                    return (
                        <motion.g
                            key={player.player_id}
                            onClick={(e) =>
                                handleSegmentClick(player, midRad, e)
                            }
                            onHoverStart={() =>
                                handleHoverStart(player, midRad)
                            }
                            onHoverEnd={handleHoverEnd}
                            style={{ cursor: 'pointer' }}
                        >
                            <motion.path
                                d={`M ${startX},${startY} A 90,90 0 ${largeArcFlag} 1 ${endX},${endY} L ${innerEndX},${innerEndY} A 50,50 0 ${largeArcFlag} 0 ${innerStartX},${innerStartY} Z`}
                                fill={stringToRouletteColor(player.player_id)}
                                opacity={
                                    selectedPlayer ? (isSelected ? 1 : 0.3) : 1
                                }
                                stroke={
                                    isSelected && isClicked
                                        ? 'white'
                                        : 'transparent'
                                }
                                strokeWidth={2}
                                animate={{
                                    scale: isSelected ? 1.05 : 1,
                                    transformOrigin: '50% 50%',
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    transformOrigin: '50% 50%',
                                    transition: { duration: 0.2 },
                                }}
                            />
                        </motion.g>
                    );
                })}

                {winner && isSpinComplete && (
                    <foreignObject x="-50" y="-50" width="100" height="100">
                        <div style={{ width: '100%', height: '100%' }}>
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.5,
                                    rotate: -rotation,
                                }}
                                animate={{ opacity: 1, scale: 0.8 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.2,
                                    ease: 'easeOut',
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <motion.div
                                    initial={{ y: 10 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <Image
                                        src={
                                            userQueries.find(
                                                (q) => q.data?._id === winner,
                                            )?.data?.imageUrl
                                        }
                                        width="60px"
                                        height="60px"
                                        borderRadius="50%"
                                        alt="User Avatar"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <Box
                                        color="white"
                                        fontSize="12px"
                                        fontWeight="bold"
                                        textAlign="center"
                                    >
                                        {
                                            userQueries.find(
                                                (q) => q.data?._id === winner,
                                            )?.data?.username
                                        }
                                    </Box>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <Box display="flex" alignItems="center">
                                        <Image
                                            src="/GinzaCoin.png"
                                            w="10px"
                                            h="10px"
                                            alt="Ginza Coin"
                                            style={{ marginRight: '2px' }}
                                        />
                                        <Box
                                            as="span"
                                            color="white"
                                            fontSize="10px"
                                            fontWeight="bold"
                                        >
                                            {formatMicroDollars(totalBet)} -{' '}
                                            {multiplier.toFixed(2)}x
                                        </Box>
                                    </Box>
                                </motion.div>
                            </motion.div>
                        </div>
                    </foreignObject>
                )}
            </motion.svg>

            {selectedPlayer && popupPosition && (
                <Box
                    position="fixed"
                    left={0}
                    top={0}
                    style={{
                        transform: `translate(${popupPosition.x}px, ${popupPosition.y}px) translate(-50%, -50%)`,
                        transformOrigin: 'center center',
                        pointerEvents: 'none',
                        zIndex: 1000,
                        minWidth: '200px',
                        background: 'transparent',
                    }}
                >
                    <PlayerRow
                        playerId={selectedPlayer}
                        betAmount={
                            players.find((p) => p.player_id === selectedPlayer)
                                ?.bet_amount || 0
                        }
                        winningChance={
                            (players.find((p) => p.player_id === selectedPlayer)
                                ?.bet_amount /
                                totalBet) *
                            100
                        }
                    />
                </Box>
            )}

            {showConfetti && winner && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={200}
                    gravity={0.3}
                    onConfettiComplete={() => {
                        setShowConfetti(false);
                    }}
                />
            )}
        </Box>
    );
};
