import { useHotkeyBlockingDisclosure } from '../hooks/useHotkeyBlockingDisclosure';
import { CustomMenuItem } from './DynamicMenuList';
import { useGameData } from '../hooks/useGameData';
import { Action, playerAction, PokerGameState } from '../../client';
import AwayModal from '../Modals/AwayModal/AwayModal';
import useGameId from '../hooks/useGameID';
import useViewer from '../hooks/useViewer';
import { useToast } from '@chakra-ui/react';

const AwayMenuItem = () => {
    const { isOpen, onOpen, onClose } = useHotkeyBlockingDisclosure();
    const gameId = useGameId();
    const { userId } = useViewer();
    const toast = useToast();
    
    const { players, playersToAway, gameState, runItTwice } = useGameData();
    const currentPlayer = players.find((player: any) => player.player_id === userId);
    const setAwayImmediately = gameState === PokerGameState.CREATE || currentPlayer?.action === Action.FOLD;
    
    // Away Now disabled during Run It Twice loadout for active players
    const isAwayNowDisabled = runItTwice !== null && currentPlayer?.action !== Action.FOLD;
    
    const handleAwayClick = () => {
        if (setAwayImmediately) {
            handleAwayNow();
        } else {
            onOpen();
        }
    };
    
    const handleAwayNow = () => {
        playerAction({
            path: {
                game_id: gameId,
            },
            body: {
                action: Action.AWAY,
            },
        })
            .then(() => {
                toast({
                    title: 'You are now away',
                    status: 'success',
                });
            })
            .catch((e: any) => {
                toast({
                    title: 'Unable to go away',
                    status: 'error',
                    duration: 2000,
                });
            });
        onClose();
    };

    const handleAwayNextHand = () => {
        if (playersToAway.includes(userId)) {
            toast({
                title: 'You are already set to away',
                status: 'error',
                duration: 2000,
            });
            return;
        }

        playerAction({
            path: {
                game_id: gameId,
            },
            body: {
                action: Action.AWAY_NEXT_HAND,
            },
        })
            .then(() => {
                toast({
                    title: 'You will be set to away after this hand',
                    status: 'success',
                });
            })
            .catch((e: any) => {
                toast({
                    title: 'Unable to set away for next hand',
                    status: 'error',
                    duration: 2000,
                });
            });
        onClose();
    };
    
    return (
        <>
            <CustomMenuItem onClick={handleAwayClick} label="Away" />
            <AwayModal 
                isOpen={isOpen} 
                onClose={onClose} 
                onAwayNow={handleAwayNow} 
                onAwayNextHand={handleAwayNextHand}
                isAwayNowDisabled={isAwayNowDisabled}
            />
        </>
    );
};

export default AwayMenuItem;
