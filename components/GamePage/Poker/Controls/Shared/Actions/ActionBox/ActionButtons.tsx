import { Button, Grid, GridItem, Text, Box } from '@chakra-ui/react';

import { useActionButtons } from '../../../../../../hooks/useActionButtons';
import { UnnecessaryFoldModal } from '../../../../../../Modals/UnnecessaryFoldModal/UnnecessaryFoldModal';
import { Action } from '../../../../../../../client';
import { useHotkeys } from 'react-hotkeys-hook';
import useViewer from '../../../../../../hooks/useViewer';

const variantColorMap: Record<string, string> = {
    foldButton: '#B64A49',
    callButton: 'green.800',
    raiseButton: 'blue.800',
};

const ActionButtons = ({
    onOpenRaiseMenu,
    onCloseRaiseMenu,
}: {
    onOpenRaiseMenu: () => void;
    onCloseRaiseMenu: () => void;
}) => {
    const { isOpen, onClose, onDecisionClick, decisionMap } =
        useActionButtons(onOpenRaiseMenu);
    const { user } = useViewer();
    const keyboardShortcuts = user?.pokerPreferences?.keyboardShortcuts ?? true;

    useHotkeys('F', () => onDecisionClick(Action.FOLD), { enabled: keyboardShortcuts });
    useHotkeys('K', () => onDecisionClick(Action.CHECK), { enabled: keyboardShortcuts });
    useHotkeys('C', () => onDecisionClick(Action.CALL), { enabled: keyboardShortcuts });
    useHotkeys('O', () => onDecisionClick(Action.CHECK_OR_FOLD), { enabled: keyboardShortcuts });
    useHotkeys('R', () => onOpenRaiseMenu(), { enabled: keyboardShortcuts });
    useHotkeys('Escape', () => onCloseRaiseMenu(), { enabled: keyboardShortcuts });

    // Define the fixed column layout
    const TOTAL_COLUMNS = 3;
    
    // Get actions organized by position
    const foldAction = decisionMap.get(Action.FOLD);
    const checkAction = decisionMap.get(Action.CHECK);
    const callAction = decisionMap.get(Action.CALL);
    const checkOrFoldAction = decisionMap.get(Action.CHECK_OR_FOLD);
    const raiseAction = decisionMap.get(Action.RAISE);
    const allInAction = decisionMap.get(Action.ALL_IN);
    
    // Determine button placement
    const leftAction = foldAction; // Fold always goes on the left
    const middleAction = callAction || checkAction; // Call or Check goes in middle
    const rightAction = raiseAction || allInAction || checkOrFoldAction; // Raise, All-In, or Check/Fold on right

    return (
        <Grid
            templateColumns={`repeat(${TOTAL_COLUMNS}, 1fr)`}
            justifyContent="center"
            gap="1.125rem"
            w="100%"
            position="relative"
        >
            {/* Left position (Fold) */}
            {leftAction && (
                <GridItem colSpan={1} w="100%" position="relative">
                    <Box
                        position="absolute"
                        w="100%"
                        h="3rem"
                        bg={variantColorMap[leftAction.variant as keyof typeof variantColorMap] || 'brand.gray25'}
                        borderRadius="0.75rem"
                        top="8px"
                        zIndex={1}
                    />
                    <Button
                        w="100%"
                        h="3rem"
                        variant={leftAction.variant}
                        onClick={leftAction.onClick}
                        isDisabled={leftAction.isDisabled}
                        isLoading={leftAction.isLoading}
                        zIndex={10}
                        textColor="brand.textWhite"
                        fontWeight={800}
                        position="relative"
                    >
                        {leftAction.text}
                    </Button>
                </GridItem>
            )}
            {!leftAction && <GridItem colSpan={1} />} {/* Empty space if no left action */}
            
            {/* Middle position (Call or Check) */}
            {middleAction && (
                <GridItem colSpan={1} w="100%" position="relative">
                    <Box
                        position="absolute"
                        w="100%"
                        h="3rem"
                        bg={variantColorMap[middleAction.variant as keyof typeof variantColorMap] || 'brand.gray25'}
                        borderRadius="0.75rem"
                        top="8px"
                        zIndex={1}
                    />
                    <Button
                        w="100%"
                        h="3rem"
                        variant={middleAction.variant}
                        onClick={middleAction.onClick}
                        isDisabled={middleAction.isDisabled}
                        isLoading={middleAction.isLoading}
                        zIndex={10}
                        textColor="brand.textWhite"
                        fontWeight={800}
                        position="relative"
                    >
                        {middleAction.text}
                    </Button>
                </GridItem>
            )}
            {!middleAction && <GridItem colSpan={1} />} {/* Empty space if no middle action */}
            
            {/* Right position (Raise or Check/Fold) */}
            {rightAction && (
                <GridItem colSpan={1} w="100%" position="relative">
                    <Box
                        position="absolute"
                        w="100%"
                        h="3rem"
                        bg={variantColorMap[rightAction.variant as keyof typeof variantColorMap] || 'brand.gray25'}
                        borderRadius="0.75rem"
                        top="8px"
                        zIndex={1}
                    />
                    <Button
                        w="100%"
                        h="3rem"
                        variant={rightAction.variant}
                        onClick={rightAction.onClick}
                        isDisabled={rightAction.isDisabled}
                        isLoading={rightAction.isLoading}
                        zIndex={10}
                        textColor="brand.textWhite"
                        fontWeight={800}
                        position="relative"
                    >
                        {rightAction.text}
                    </Button>
                </GridItem>
            )}
            {!rightAction && <GridItem colSpan={1} />} {/* Empty space if no right action */}
            
            <UnnecessaryFoldModal
                onDecisionClick={() => onDecisionClick(Action.FOLD, true)}
                isOpen={isOpen}
                onClose={onClose}
            />
        </Grid>
    );
};

export default ActionButtons;
