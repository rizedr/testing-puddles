import { Button, Text, VStack, HStack } from '@chakra-ui/react';
import { GinzaModal } from '../GinzaModal';
import { FaExclamationTriangle } from 'react-icons/fa';

interface AwayModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAwayNow: () => void;
    onAwayNextHand: () => void;
    isAwayNowDisabled?: boolean;
}

export function AwayModal({
    isOpen,
    onClose,
    onAwayNow,
    onAwayNextHand,
    isAwayNowDisabled = false,
}: AwayModalProps) {
    const content = (
        <VStack>
            <HStack alignItems="center">
                <FaExclamationTriangle color="yellow" />
                <Text fontSize="1.25rem" textAlign="start">
                    Going away now will fold your current hand.
                </Text>
            </HStack>
            <Text variant="modalH2" color="gray.300" textAlign="start">
                If you wish to play your current hand then select Away Next Hand.
            </Text>
            {isAwayNowDisabled && (
                <Text variant="modalH2" color="red.300" textAlign="start">
                    Away Now disabled for active players in Run It Twice loadout.
                </Text>
            )}
        </VStack>
    );

    return (
        <GinzaModal
            isOpen={isOpen}
            onClose={onClose}
            title="Set Away"
            content={content}
            primaryButton={
                <Button variant="walletButton" onClick={onAwayNextHand}>
                    Away Next Hand
                </Button>
            }
            secondaryButton={
                <Button 
                    variant="walletButton" 
                    onClick={onAwayNow}
                    isDisabled={isAwayNowDisabled}
                >
                    Away Now
                </Button>
            }
        />
    );
}

export default AwayModal;
