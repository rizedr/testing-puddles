import { Button, Text, useToast } from '@chakra-ui/react';
import { Action, playerAction, Player } from '../../../client';
import APIButton from '../../Shared/APIButton';
import { usePlayerUsername } from '../../hooks/usePlayerUsername';
import { GinzaModal } from '../GinzaModal';
import useGameId from '../../hooks/useGameID';

interface SetHostModalProps {
    isOpen: boolean;
    onClose: () => void;
    player: Player | null;
}

export function SetHostModal({ isOpen, onClose, player }: SetHostModalProps) {
    const toast = useToast();
    const playerUsername = usePlayerUsername(player?.player_id ?? '');
    const gameId = useGameId();

    const onSuccess = () => {
        toast({
            title: 'Host Transfer Complete',
            description: `${playerUsername} is now the host.`,
            status: 'success',
            duration: 2000,
        });
        onClose();
    };

    const onError = () => {
        toast({
            title: 'Unable to set host',
            description: `An error occurred while setting ${playerUsername} as host.`,
            status: 'error',
            duration: 2000,
        });
    };

    if (!player) {
        throw new Error('Player not found.');
    }

    return (
        <GinzaModal
            isOpen={isOpen}
            onClose={onClose}
            title="Host Transfer"
            content={
                <Text>
                    You are passing host responsibilities to {playerUsername}
                </Text>
            }
            primaryButton={
                <APIButton
                    endpoint={playerAction}
                    params={{
                        path: {
                            game_id: gameId,
                        },
                        body: {
                            action: Action.SET_HOST,
                            action_target: player.player_id,
                        },
                    }}
                    onSuccess={onSuccess}
                    onError={onError}
                    variant="primary"
                >
                    Confirm
                </APIButton>
            }
            secondaryButton={
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            }
        />
    );
}

export default SetHostModal;
