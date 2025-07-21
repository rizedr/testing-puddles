import { Button, Text, VStack } from '@chakra-ui/react';
import { Action } from '../../../client';
import { GinzaModal } from '../GinzaModal';

interface UnnecessaryFoldModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDecisionClick: (decision: Action) => void;
}

export function UnnecessaryFoldModal({
    isOpen,
    onClose,
    onDecisionClick,
}: UnnecessaryFoldModalProps) {
    const handleFold = () => {
        onDecisionClick(Action.FOLD);
        onClose();
    };

    const content = (
        <VStack>
            <Text size="lg" textAlign="start" fontStyle="italic">
                Are you sure you want to fold?
            </Text>
            <Text variant="modalH2" textAlign="start">
                You are able to check the current bet.
            </Text>
        </VStack>
    );

    return (
        <GinzaModal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Action"
            content={content}
            primaryButton={
                <Button variant="primary" onClick={handleFold}>
                    Confirm
                </Button>
            }
            secondaryButton={
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            }
        />
    );
}

export default UnnecessaryFoldModal;
