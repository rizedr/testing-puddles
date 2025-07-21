import React, { useState } from 'react';
import { VStack, HStack, Text, Box, useToast, useBreakpointValue } from '@chakra-ui/react';
import { getGameTypeString } from './utils';
import { useGameCard } from './useGameCard';
import { GameDetails, GameProgressStatus } from '../../hooks/useGameHistory';
import {
    formatBlindsWithSymbol,
    formatMicroDollarsWithCommas,
} from '../../utils/formatMoney';

import { FaPlay } from 'react-icons/fa';
import GameStatusIcon from '../../Modals/ProfileModal/GameStatusIcon/GameStatusIcon';
import { useHotkeyBlockingDisclosure } from '../../hooks/useHotkeyBlockingDisclosure';
import { Button } from '@chakra-ui/react';
import {
    convertCurrencyToDisplay,
    convertPNLCurrencyToDisplay,
} from '../../utils/convertCurrency';
import ShareGameButton from './ShareGameButton';
import { ShareGameModal } from './ShareGameModal';
import { handleShareClick } from './generateGameImage';
import { GiPokerHand } from 'react-icons/gi';
import { Doc, Id } from '../../../../../packages/convex/convex/_generated/dataModel';
import { LogGameButton } from './LogGameButton';
import { LogGameModal } from './LogGameModal';

export const GameCardHeader = ({
    game,
    gameData,
    isOtherUser,
    user,
    handleRejoinGame,
}: {
    game: GameDetails;
    gameData: Doc<'gameData'>;
    isOtherUser: boolean;
    user: Doc<'users'>;
    handleRejoinGame: () => void;
}) => {
    const { smallBlind, bigBlind, gameMode, nonce } = useGameCard(game, gameData);
    const { isOpen, onOpen, onClose } = useHotkeyBlockingDisclosure();
    const { isOpen: isLogOpen, onOpen: onLogOpen, onClose: onLogClose } = useHotkeyBlockingDisclosure();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const toast = useToast();
    const isPortrait = useBreakpointValue({ base: true, lg: false, xl: false });

    // Check if game is completed - show log button for all completed games
    const isCompleted = gameData?.archived;

    return (
        <>
            <VStack align="start" spacing={1} width="100%">
                <HStack justify="space-between" width="100%" align="start">
                    <VStack align="start">
                        <Text
                            ml="4px"
                            fontSize="18px"
                            fontWeight="800"
                            textAlign="left"
                            display="flex"
                            alignItems="center"
                        >
                            {getGameTypeString(gameMode) === "NL HOLD'EM" && (
                                <img
                                    src="/HoldemIcon.png"
                                    style={{
                                        marginRight: '6px',
                                        width: '22px',
                                        height: '22px',
                                    }}
                                />
                            )}
                            {getGameTypeString(gameMode) === 'POT-LIMIT OMAHA' && (
                                <GiPokerHand
                                    style={{
                                        marginRight: '6px',
                                        width: '26px',
                                        height: '26px',
                                    }}
                                />
                            )}
                            {getGameTypeString(gameMode) === "NL HOLD'EM"
                                ? "NO-LIMIT HOLD'EM"
                                : getGameTypeString(gameMode)}{' '}
                        </Text>
                        <HStack>
                            <Box
                                as="span"
                                fontWeight="semibold"
                                color="brand.accentWhite"
                                border="1px solid rgba(255, 255, 255, 0.75)"
                                borderRadius="0.5rem"
                                px="4px"
                                py="2px"
                                ml="3.5px"
                                fontSize="14px"
                            >
                                ${formatMicroDollarsWithCommas(smallBlind)}/$
                                {formatMicroDollarsWithCommas(bigBlind)}
                            </Box>
                            <GameStatusIcon
                                status={
                                    gameData?.archived
                                        ? GameProgressStatus.WITHDRAWN
                                        : GameProgressStatus.ACTIVE
                                }
                            />
                        </HStack>
                    </VStack>
                    {!isOtherUser && (
                        <HStack>
                            {!gameData?.archived ? (
                                <Button
                                    onClick={handleRejoinGame}
                                    variant="walletButton"
                                    textColor="brand.accentWhite"
                                    fontSize="14px"
                                    borderRadius="10px"
                                    width={isPortrait ? "42px" : "90px"}
                                    height="40px"
                                    boxShadow="2px 2px 3px 0px rgba(0, 0, 0, 0.50)"
                                >
                                    {isPortrait ? (
                                        <FaPlay size={16} />
                                    ) : (
                                        <>
                                            Rejoin{' '}
                                            <FaPlay
                                                size={10}
                                                style={{ marginLeft: '6px' }}
                                            />
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <>
                                    {isCompleted && (
                                        <LogGameButton 
                                            onClick={onLogOpen}
                                            isPortrait={isPortrait}
                                            nonce={nonce}
                                        />
                                    )}
                                    <ShareGameButton
                                        onClick={() =>
                                            handleShareClick(
                                                game.game_id,
                                                game,
                                                user,
                                                smallBlind,
                                                bigBlind,
                                                setImageUrl,
                                                onOpen,
                                            )
                                        }
                                        isPortrait={isPortrait}
                                    />
                                    <ShareGameModal
                                        isOpen={isOpen}
                                        onClose={() => {
                                            onClose();
                                            setImageUrl(null);
                                        }}
                                        imageUrl={imageUrl}
                                        gameData={{
                                            gameId: game.game_id,
                                            username: user?.username || '',
                                            blinds: formatBlindsWithSymbol(
                                                smallBlind,
                                                bigBlind,
                                            ),
                                            buyIn: `$${convertCurrencyToDisplay(game.buy_in)}`,
                                            cashOut: `$${convertCurrencyToDisplay(game.cashout)}`,
                                            pnl: convertPNLCurrencyToDisplay(
                                                game.buy_in,
                                                game.cashout,
                                            ),
                                        }}
                                    />
                                </>
                            )}
                        </HStack>
                    )}
                </HStack>
                <HStack justify="space-between" width="100%">
                    <HStack>
                        <Box
                            as="button"
                            onClick={() => {
                                navigator.clipboard
                                    .writeText(game.game_id)
                                    .then(() => {
                                        toast({
                                            title: 'Copied to clipboard',
                                            description:
                                                'Game ID copied to clipboard',
                                            status: 'success',
                                            duration: 3000,
                                            isClosable: true,
                                        });
                                    });
                            }}
                            cursor="pointer"
                            _hover={{ opacity: 0.8 }}
                        ></Box>
                    </HStack>
                </HStack>
            </VStack>

            {/* Log Modal */}
            <LogGameModal
                isOpen={isLogOpen}
                onClose={onLogClose}
                gameId={game.game_id}
            />
        </>
    );
};
