import HostSettingsStep from '../Shared/HostSettingsStep';
import { GinzaSurface } from '../GinzaModal';
import { useState, useEffect } from 'react';
import { Button, useToast, Alert, AlertIcon, AlertDescription, VStack } from '@chakra-ui/react';
import { FaSave } from 'react-icons/fa';
import useGameData from '../../hooks/useGameData';
import { useIsGameHost } from '../../hooks/useIsGameHost';
import useGameId from '../../hooks/useGameID';
import { playerAction, Action } from '../../../client';

interface GameSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GameSettings: React.FC<GameSettingsModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { gameSettings, gameState } = useGameData();
    const isHost = useIsGameHost();
    const gameId = useGameId();
    const [bombPotBB, setBombPotBB] = useState('');
    const [bombPotFrequency, setBombPotFrequency] = useState('');
    const [ante, setAnte] = useState('');
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        setBombPotBB(gameSettings?.bomb_pot_bb > 0 ? gameSettings.bomb_pot_bb.toString() : '');
        setBombPotFrequency(gameSettings?.bomb_pot_frequency > 0 ? gameSettings.bomb_pot_frequency.toString() : '');
        
        // Convert ante_value from microDollars to BB format
        if (gameSettings?.ante_value && gameSettings?.big_blind_value) {
            const anteInBB = gameSettings.ante_value / gameSettings.big_blind_value;
            setAnte(anteInBB > 0 ? anteInBB.toFixed(1) : '');
        } else {
            setAnte('');
        }
    }, [gameSettings?.bomb_pot_bb, gameSettings?.bomb_pot_frequency, gameSettings?.ante_value, gameSettings?.big_blind_value]);

    const hasChanges = (
        (bombPotBB !== '' && bombPotBB !== gameSettings?.bomb_pot_bb?.toString()) ||
        (bombPotFrequency !== '' && bombPotFrequency !== gameSettings?.bomb_pot_frequency?.toString()) ||
        (bombPotBB === '' && gameSettings?.bomb_pot_bb !== 0) ||
        (bombPotFrequency === '' && gameSettings?.bomb_pot_frequency !== 0) ||
        (ante !== '' && gameSettings?.ante_value !== undefined && gameSettings?.big_blind_value !== undefined && 
         ante !== (gameSettings.ante_value / gameSettings.big_blind_value).toFixed(1)) ||
        (ante === '' && gameSettings?.ante_value !== 0)
    );

    const handleSettingsChange = async () => {
        setPending(true);
        setError(null);
        try {
            if (!isHost) throw new Error('Only the host can update game settings.');
            if (!gameSettings || !gameId) throw new Error('Game settings or game ID not found.');
            
            // Convert empty strings to 0, otherwise parse as numbers
            const newBB = bombPotBB === '' ? 0 : parseInt(bombPotBB, 10);
            const newFreq = bombPotFrequency === '' ? 0 : parseInt(bombPotFrequency, 10);
            const newAnte = ante === '' ? 0 : parseFloat(ante);
            
            // Validate input ranges
            if (bombPotBB !== '' && (isNaN(newBB) || newBB < 1 || newBB > 10)) {
                throw new Error('Bomb pot ante must be between 1-10.');
            }
            if (bombPotFrequency !== '' && (isNaN(newFreq) || newFreq < 1 || newFreq > 30)) {
                throw new Error('Bomb pot frequency must be between 1-30.');
            }
            if (ante !== '' && (isNaN(newAnte) || newAnte < 0 || newAnte > 2)) {
                throw new Error('Ante must be between 0-2 BB.');
            }
            
            // Require both bomb pot fields to be filled or both to be empty
            if ((newBB === 0 && newFreq > 0) || (newBB > 0 && newFreq === 0)) {
                throw new Error('Requires both ante and frequency to activate bomb pots.');
            }
            
            // Convert ante from BB to microDollars
            const anteInMicroDollars = newAnte * (gameSettings.big_blind_value || 0);
            
            // Use playerAction with UPDATE_SETTINGS action
            await playerAction({
                path: {
                    game_id: gameId,
                },
                body: {
                    action: Action.UPDATE_SETTINGS,
                    update_settings: {
                        bomb_pot_bb: newBB,
                        bomb_pot_frequency: newFreq,
                        ante_value: Math.round(anteInMicroDollars),
                    },
                },
            });

            // Show success message based on game state
            if (gameState === 0) { // CREATE state
                toast({
                    title: 'Settings Updated',
                    description: 'Game settings have been applied immediately.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Setting Updates Queued',
                    description: 'New Settings will be applied at the start of the next hand.',
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                });
            }
            
            // Close modal on success
            onClose();
            
        } catch (err: any) {    
            setError(err.message || 'Failed to update game settings.');
        } finally {
            setPending(false);
        }
    };

    if (!gameSettings) return null;

    return (
        <GinzaSurface
            isOpen={isOpen}
            onClose={onClose}
            title="Game Settings"
            content={
                <VStack spacing={4} w="100%">
                    {error && (
                        <Alert status="error" bg="red.900" borderRadius="md">
                            <AlertIcon color="red.300" />
                            <AlertDescription color="red.100" fontWeight="medium">{error}</AlertDescription>
                        </Alert>
                    )}
                    <HostSettingsStep
                        bombPotBB={bombPotBB}
                        setBombPotBB={setBombPotBB}
                        bombPotFrequency={bombPotFrequency}
                        setBombPotFrequency={setBombPotFrequency}
                        ante={ante}
                        setAnte={setAnte}
                        pending={pending}
                        isHost={isHost}
                    />
                </VStack>
            }
            primaryButton={isHost && (
                <Button
                    variant="walletButton"
                    isDisabled={!hasChanges || pending}
                    isLoading={pending}
                    onClick={handleSettingsChange}
                    rightIcon={<FaSave />}
                    colorScheme={!hasChanges ? 'gray' : 'purple'}
                >
                    Save
                </Button>
            )}
        />
    );
};

export default GameSettings;
